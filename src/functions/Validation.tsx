import { identify } from 'sql-query-identifier';
import PasswordValidator from 'password-validator';
import validator from 'validator';
import axios from 'axios';

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
  text?: TextRules;
  password?: PasswordRules;
}

interface TextRules {
  validator: keyof typeof validator;
  args?: any;
}

interface PasswordRules {
  default?: boolean;
  minLength?: number;
  uppercase?: number;
  lowercase?: number;
  digits?: number;
  symbols?: number;
  spaces?: number;
}

async function getIp() {
  const url = "https://api.ipify.org?format=json";
  let ip = '';
  try {
    const response = await axios.get(url);
    ip = response.data.ip;
  } catch (error) {
  }
  return ip;
}

export async function sendLog(type: string, message: string, url: string) {
  const server = url + "/api/log";
  const userAgent = navigator.userAgent;
  const ip = await getIp();
  const body = { type, message, userAgent, ip };

  axios.post(server, body)
    .then(response => {
      console.log('Log sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending log:', error);
    });
}

export default function validation(input: string, type: ValidationType = {}, sendLogsTo?: string) {
  if (type.text) {
    let textRules = type.text;
    const validate = (validator[textRules.validator] as (input: string, options?: any) => boolean)(input,
      textRules.args);

    if (!validate) {
      throw new Error("Validation failed: " + textRules.validator);
    }
  }
  if (type.password) {
    const passwordSchema = new PasswordValidator();
    const passwordRules = type.password;
    const defaultRules = { minLength: 8, uppercase: 1, lowercase: 1, digits: 1, symbols: 1, spaces: 0 };
    const isDefault = type.password.default ?? false;
    if (isDefault) {
      // Support overriding default rules
      if (!passwordRules.minLength) {
        passwordRules.minLength = defaultRules.minLength;
      }
      if (!passwordRules.uppercase) {
        passwordRules.uppercase = defaultRules.uppercase;
      }
      if (!passwordRules.lowercase) {
        passwordRules.lowercase = defaultRules.lowercase;
      }
      if (!passwordRules.digits) {
        passwordRules.digits = defaultRules.digits;
      }
      if (!passwordRules.symbols) {
        passwordRules.symbols = defaultRules.symbols;
      }
      if (!passwordRules.spaces) {
        passwordRules.spaces = defaultRules.spaces;
      }
    }

    if (passwordRules.minLength) {
      passwordSchema.is().min(passwordRules.minLength);
    }
    if (passwordRules.uppercase) {
      passwordSchema.has().uppercase(passwordRules.uppercase);
    }
    if (passwordRules.lowercase) {
      passwordSchema.has().lowercase(passwordRules.lowercase);
    }
    if (passwordRules.digits) {
      passwordSchema.has().digits(passwordRules.digits);
    }
    if (passwordRules.symbols) {
      passwordSchema.has().symbols(passwordRules.symbols);
    }
    if (passwordRules.spaces) {
      passwordSchema.has().not().spaces(passwordRules.spaces);
    }

    const validationResult = passwordSchema.validate(input, { details: true });

    if (typeof validationResult !== 'boolean') {
      validationResult.forEach((rule: any) => {
        if (rule.message) {
          const errorMsg = rule.message;
          throw new Error(errorMsg);
        }
      });
    }

  }
  const isSql = type?.sql ?? false;
  if (isSql) {
    const sqlQueries = extractSQLQueries(input);
    if (sqlQueries.length > 0) {
      for (const query of sqlQueries) {
        const res = identify(query, { strict: false });
        if (res[0].type !== 'UNKNOWN') {
          const errorMsg = `SQL query of type ${res[0].type} detected`;
          if (sendLogsTo) {
            sendLog("sql", errorMsg, sendLogsTo);
          }
          throw new Error(errorMsg);
        }
      }
    }
  }
}
