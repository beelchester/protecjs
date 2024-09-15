import validate from '../functions/Validation';
import fs from 'fs';
import path from 'path';

interface TestCase {
  input: string;
  expected: string;
}

describe("SQL Validation Tests", () => {
  const testCasesPath = path.join(__dirname, 'sqlValidationTests.json');
  const testCases: TestCase[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

  testCases.forEach(({ input, expected }) => {
    test(`Validates query: ${input}`, () => {
      let result: string | undefined;
      try {
        validate(input, { sql: true });
      } catch (error: any) {
        result = error.message;
      }
      expect(result).toBe(expected);
    });
  });
});
