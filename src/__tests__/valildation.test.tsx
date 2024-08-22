import validation from '../functions/Validation';
import fs from 'fs';
import path from 'path';

interface TestCase {
    input: string;
    expected: string;
}

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

    const groupedTestCases: { [key: string]: TestCase[] } = {
        "CREATE": [],
        "DROP": [],
        "ALTER": [],
        "SHOW": [],
        "UPDATE_DELETE_TRUNCATE": [],
        "UNKNOWN": []
    };
    
    
    testCases.forEach(({ input, expected }) => {
        if (!Array.isArray(input) || !Array.isArray(expected)) {
            throw new TypeError('Expected input and expected to be arrays');
        }
    
        input.forEach((query, index) => {
            const expectedMessage = expected[index];
            if (typeof query !== 'string' || typeof expectedMessage !== 'string') {
                throw new TypeError('Expected elements of input and expected to be strings');
            }
    
            
            if (query.startsWith("CREATE")) {
                groupedTestCases.CREATE.push({ input: query, expected: expectedMessage });
            } else if (query.startsWith("DROP")) {
                groupedTestCases.DROP.push({ input: query, expected: expectedMessage });
            } else if (query.startsWith("ALTER")) {
                groupedTestCases.ALTER.push({ input: query, expected: expectedMessage });
            } else if (query.startsWith("SHOW")) {
                groupedTestCases.SHOW.push({ input: query, expected: expectedMessage });
            } else if (["UPDATE", "DELETE", "TRUNCATE"].some(keyword => query.startsWith(keyword))) {
                groupedTestCases.UPDATE_DELETE_TRUNCATE.push({ input: query, expected: expectedMessage });
            } else {
                groupedTestCases.UNKNOWN.push({ input: query, expected: expectedMessage });
            }
        });
    });
    
    Object.keys(groupedTestCases).forEach(group => {
        describe(`${group} queries`, () => {
            groupedTestCases[group].forEach(({ input, expected }) => {
                test(`Validates query: ${input}`, () => {
                    try {
                        validation(input);
                    } catch (error) {
                        if (error instanceof Error) {
                            expect(error.message).toThrow(expected);
                        } else {
                            throw error;
                        }
                    }
                });
            });
        });
    });
});    