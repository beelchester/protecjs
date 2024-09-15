import { identify } from 'sql-query-identifier';
import PasswordValidator from 'password-validator';
import validator from 'validator';

const keywords = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "SELECT",
  "TRUNCATE",
  "CREATE DATABASE",
  "CREATE SCHEMA",
  "CREATE TABLE",
  "CREATE VIEW",
  "CREATE TRIGGER",
  "CREATE FUNCTION",
  "CREATE INDEX",
  "CREATE PROCEDURE",
  "DROP DATABASE",
  "DROP SCHEMA",
  "DROP TABLE",
  "DROP VIEW",
  "DROP TRIGGER",
  "DROP FUNCTION",
  "DROP INDEX",
  "DROP PROCEDURE",
  "ALTER DATABASE",
  "ALTER SCHEMA",
  "ALTER TABLE",
  "ALTER VIEW",
  "ALTER TRIGGER",
  "ALTER FUNCTION",
  "ALTER INDEX",
  "ALTER PROCEDURE",
  "SHOW BINARY", // MySQL and generic dialects only
  "SHOW BINLOG", // MySQL and generic dialects only
  "SHOW CHARACTER", // MySQL and generic dialects only
  "SHOW COLLATION", // MySQL and generic dialects only
  "SHOW COLUMNS", // MySQL and generic dialects only
  "SHOW CREATE", // MySQL and generic dialects only
  "SHOW DATABASES", // MySQL and generic dialects only
  "SHOW ENGINE", // MySQL and generic dialects only
  "SHOW ENGINES", // MySQL and generic dialects only
  "SHOW ERRORS", // MySQL and generic dialects only
  "SHOW EVENTS", // MySQL and generic dialects only
  "SHOW FUNCTION", // MySQL and generic dialects only
  "SHOW GRANTS", // MySQL and generic dialects only
  "SHOW INDEX", // MySQL and generic dialects only
  "SHOW MASTER", // MySQL and generic dialects only
  "SHOW OPEN", // MySQL and generic dialects only
  "SHOW PLUGINS", // MySQL and generic dialects only
  "SHOW PRIVILEGES", // MySQL and generic dialects only
  "SHOW PROCEDURE", // MySQL and generic dialects only
  "SHOW PROCESSLIST", // MySQL and generic dialects only
  "SHOW PROFILE", // MySQL and generic dialects only
  "SHOW PROFILES", // MySQL and generic dialects only
  "SHOW RELAYLOG", // MySQL and generic dialects only
  "SHOW REPLICAS", // MySQL and generic dialects only
  "SHOW SLAVE", // MySQL and generic dialects only
  "SHOW REPLICA", // MySQL and generic dialects only
  "SHOW STATUS", // MySQL and generic dialects only
  "SHOW TABLE", // MySQL and generic dialects only
  "SHOW TABLES", // MySQL and generic dialects only
  "SHOW TRIGGERS", // MySQL and generic dialects only
  "SHOW VARIABLES",
  "SHOW WARNINGS",
  "UNKNOWN"
];

function extractSQLQueries(input: string) {
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
  const queries = [];
  let currentIndex = 0;

  while (currentIndex < input.length) {
    const match = input.slice(currentIndex).match(regex);
    if (!match) break;

    const keywordIndex = currentIndex + (match.index as number);
    const endIndex = input.indexOf(';', keywordIndex);
    if (endIndex === -1) break;

    queries.push(input.slice(keywordIndex, endIndex + 1).trim());
    currentIndex = endIndex + 1;
  }

  return queries;
}

interface ValidationType {
  sql?: boolean;
  type?: 'text' | 'password';
}

interface TextRules {
  validator: keyof typeof validator;
  args: any;
}

export default function validation(input: string, type: ValidationType = {}) {
  // passwordRules: { minLength?: number; uppercase?: number; lowercase?: number; digits?: number; symbols?: number; spaces?: number } = {}
  if (type.text) {
    let textRules = type.text;
    const validate = (validator[textRules.validator] as (input: string, options?: any) => boolean)(input,
      textRules.args);

    if (!validate) {
      const errorMsg = textRules.args ? "Validation failed: " + textRules.validator + " " + textRules.args : "Validation failed: " + textRules.validator;
      throw new Error(errorMsg);
    }
  }
  if (type.type === 'password') {
    const passwordSchema = new PasswordValidator();

    // Set password rules
    passwordSchema
      .is().min(passwordRules.minLength || 8)  // Minimum length
      .has().uppercase(passwordRules.uppercase || 1)  // At least one uppercase letter
      .has().lowercase(passwordRules.lowercase || 1)  // At least one lowercase letter
      .has().digits(passwordRules.digits || 1)  // At least one digit
      .has().symbols(passwordRules.symbols || 1)  // At least one special character
      .has().not().spaces(passwordRules.spaces || 0);  // No spaces allowed

    const validationResult = passwordSchema.validate(input, { details: true });

    // If validationResult is true (i.e., validation passed), we skip the error handling
    if (Array.isArray(validationResult) && validationResult.length > 0) {
      const errorMessages = validationResult.map((rule: any) => {
        switch (rule.validation) {
          case 'min':
            return 'Password must be at least 8 characters long';
          case 'uppercase':
            return 'Password must have at least 1 uppercase letter';
          case 'lowercase':
            return 'Password must have at least 1 lowercase letter';
          case 'digits':
            return 'Password must contain at least 1 digit';
          case 'symbols':
            return 'Password must contain at least 1 special character';
          case 'spaces':
            return 'Password must not contain spaces';
          default:
            return 'Password validation failed';
        }
      });
      throw new Error(errorMessages.join(', '));
    }
  }
  const isSql = type?.sql ?? false;
  if (isSql) {
    const sqlQueries = extractSQLQueries(input);
    if (sqlQueries.length > 0) {
      for (const query of sqlQueries) {
        const res = identify(query, { strict: false });
        if (res[0].type !== 'UNKNOWN') {
          throw new Error(`SQL query of type ${res[0].type} detected`);
        }
      }
    }
  }
}
