import { NextRequest, NextResponse } from 'next/server';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    // Create temporary file
    const tempDir = tmpdir();
    const tempFile = join(tempDir, `bpp_${Date.now()}.bpp`);
    writeFileSync(tempFile, code);

    // Get the path to the Python interpreter files
    // Use the deployed copy inside the web folder
    const compilerDir = join(process.cwd(), 'compiler');
    
    // Run the interpreter
    try {
      let output: string = '';
      const mainPyPath = join(compilerDir, 'main.py');
      
      // Check if file exists
      if (!existsSync(mainPyPath)) {
        return NextResponse.json({
          success: false,
          output: null,
          error: `Python file not found: ${mainPyPath}`
        });
      }
      
      // Try python3
      let result = spawnSync('python3', [mainPyPath, tempFile], {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 5000,
        cwd: compilerDir,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      // If python3 fails, try python
      if (result.error || result.status !== 0) {
        result = spawnSync('python', [mainPyPath, tempFile], {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024,
          timeout: 5000,
          cwd: compilerDir,
          env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });
      }

      // Clean up
      try {
        unlinkSync(tempFile);
      } catch (e) {
        // Ignore
      }

      if (result.error) {
        return NextResponse.json({
          success: false,
          output: null,
          error: `Failed to execute Python: ${result.error.message}`
        });
      }

      if (result.status !== 0) {
        const stderr = result.stderr?.trim() || result.stdout?.trim() || 'Unknown error';
        return NextResponse.json({
          success: false,
          output: null,
          error: stderr
        });
      }

      output = (result.stdout || '').trim();

      return NextResponse.json({
        success: true,
        output: output,
        error: null
      });
    } catch (err: any) {
      try {
        unlinkSync(tempFile);
      } catch (e) {
        // Ignore cleanup errors
      }

      return NextResponse.json({
        success: false,
        output: null,
        error: `Error: ${err.message}`
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
