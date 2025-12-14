import { runCode } from './compiler/main';

// Test simple variable declaration and print
const code1 = `
dhori x = 5;
dekhao x;
`;

try {
  const result1 = runCode(code1);
  console.log('Test 1 - Simple var and print:');
  console.log(result1);
  console.log('---');
} catch (e: any) {
  console.error('Test 1 failed:', e.message);
}

// Test if statement
const code2 = `
dhori x = 10;
jodi x > 5 {
  dekhao 1;
} nahole {
  dekhao 0;
}
`;

try {
  const result2 = runCode(code2);
  console.log('Test 2 - If statement:');
  console.log(result2);
  console.log('---');
} catch (e: any) {
  console.error('Test 2 failed:', e.message);
}

// Test for loop
const code3 = `
ghuri (dhori i = 0; i < 3; i = i + 1) {
  dekhao i;
}
`;

try {
  const result3 = runCode(code3);
  console.log('Test 3 - For loop:');
  console.log(result3);
  console.log('---');
} catch (e: any) {
  console.error('Test 3 failed:', e.message);
}
