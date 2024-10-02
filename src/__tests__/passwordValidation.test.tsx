import validate from '../functions/Validation';
import fs from 'fs';
import path from 'path';

interface TestCase {
  input: string;
  expected: string | undefined;
}

describe("Password Validation Tests", () => {
  const testCasesPath = path.join(__dirname, 'passwordValidationTests.json');
  const testCases: TestCase[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

  testCases.forEach(({ input, expected }) => {
    test(`Validates password: ${input}`, () => {  // Corrected line
      let result: string | undefined;
      try {
        validate(input, { password: { default: true } });
      } catch (error: any) {
        result = error.message;
      }

      expect(result).toBe(expected);
    });
  });
});
