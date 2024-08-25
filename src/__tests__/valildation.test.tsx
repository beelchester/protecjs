import validation from '../functions/Validation';
import fs from 'fs';
import path from 'path';
import { identify } from 'sql-query-identifier';

interface TestCase {
  input: string;
  expected: string;
}

jest.mock('sql-query-identifier', () => ({
  identify: jest.fn(),
}));

beforeAll(() => {
  global.alert = jest.fn();
});

describe("SQL Validation Tests", () => {
  const originalLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    jest.restoreAllMocks();
  });

  const testCasesPath = path.join(__dirname, 'sqlValidationTests.json');
  const testCases: TestCase[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

  testCases.forEach(({ input, expected }) => {
    test(`Validates query: ${input}`, () => {
      const expectedTypeMatch = expected.match(/SQL query of type (\w+)/);
      const expectedType = expectedTypeMatch ? expectedTypeMatch[1] : 'UNKNOWN';

      (identify as jest.Mock).mockReturnValue([{ type: expectedType }]);

      try {
        validation(input);
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe(expected);
        } else {
          throw error;
        }
      }

      if (expected.includes("SQL query detected!")) {
        expect(global.alert).toHaveBeenCalledWith("SQL query detected!");
      }
    });
  });
});