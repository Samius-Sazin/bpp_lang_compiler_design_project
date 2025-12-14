import { NextRequest, NextResponse } from 'next/server';
import { runCode } from '../../../compiler/main';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    try {
      const output = runCode(code);

      return NextResponse.json({
        success: true,
        output: output,
        error: null
      });
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        output: null,
        error: err.message
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
