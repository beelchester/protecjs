import { identify } from 'sql-query-identifier';
import Validator from 'validatorjs';

const keywords = [
  "UPDATE",
  "DELETE",
  "SELECT",
  "TRUNCATE",
  "CREATE_DATABASE",
  "CREATE_SCHEMA",
  "CREATE_TABLE",
  "CREATE_VIEW",
  "CREATE_TRIGGER",
  "CREATE_FUNCTION",
  "CREATE_INDEX",
  "CREATE_PROCEDURE",
  "DROP_DATABASE",
  "DROP_SCHEMA",
  "DROP_TABLE",
  "DROP_VIEW",
  "DROP_TRIGGER",
  "DROP_FUNCTION",
  "DROP_INDEX",
  "DROP_PROCEDURE",
  "ALTER_DATABASE",
  "ALTER_SCHEMA",
  "ALTER_TABLE",
  "ALTER_VIEW",
  "ALTER_TRIGGER",
  "ALTER_FUNCTION",
  "ALTER_INDEX",
  "ALTER_PROCEDURE",
  "ANON_BLOCK",
  "SHOW_BINARY",
  "SHOW_BINLOG",
  "SHOW_CHARACTER",
  "SHOW_COLLATION",
  "SHOW_COLUMNS",
  "SHOW_CREATE",
  "SHOW_DATABASES",
  "SHOW_ENGINE",
  "SHOW_ENGINES",
  "SHOW_ERRORS",
  "SHOW_EVENTS",
  "SHOW_FUNCTION",
  "SHOW_GRANTS",
  "SHOW_INDEX",
  "SHOW_MASTER",
  "SHOW_OPEN",
  "SHOW_PLUGINS",
  "SHOW_PRIVILEGES",
  "SHOW_PROCEDURE",
  "SHOW_PROCESSLIST",
  "SHOW_PROFILE",
  "SHOW_PROFILES",
  "SHOW_RELAYLOG",
  "SHOW_REPLICAS",
  "SHOW_SLAVE",
  "SHOW_REPLICA",
  "SHOW_STATUS",
  "SHOW_TABLE",
  "SHOW_TABLES",
  "SHOW_TRIGGERS",
  "SHOW_VARIABLES",
  "SHOW_WARNINGS",
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


export default function validation(input: string, rules: object) {
  const data = { text: input };
  const validation = new Validator(data, rules);

  if (validation.fails()) {
    throw new Error(`Validation failed: ${Object.values(validation.errors.all()).join(', ')}`);
  }

  const sqlQueries = extractSQLQueries(input);
  if (sqlQueries.length > 0) {
    console.log("SQL queries detected!");
    for (const query of sqlQueries) {
      const res = identify(query, { strict: false });
      console.log(res[0].type);
      if (res[0].type === 'UNKNOWN') {
        console.log("It is not a recognized SQL query.");
      } else {
        throw new Error(`SQL query of type ${res[0].type} detected: ${query}`);
      }
    }
  }
}
