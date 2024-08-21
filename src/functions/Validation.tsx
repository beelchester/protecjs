import { identify } from "sql-query-identifier";
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
  "ANON_BLOCK", // BigQuery and Oracle dialects only
  "SHOW_BINARY", // MySQL and generic dialects only
  "SHOW_BINLOG", // MySQL and generic dialects only
  "SHOW_CHARACTER", // MySQL and generic dialects only
  "SHOW_COLLATION", // MySQL and generic dialects only
  "SHOW_COLUMNS", // MySQL and generic dialects only
  "SHOW_CREATE", // MySQL and generic dialects only
  "SHOW_DATABASES", // MySQL and generic dialects only
  "SHOW_ENGINE", // MySQL and generic dialects only
  "SHOW_ENGINES", // MySQL and generic dialects only
  "SHOW_ERRORS", // MySQL and generic dialects only
  "SHOW_EVENTS", // MySQL and generic dialects only
  "SHOW_FUNCTION", // MySQL and generic dialects only
  "SHOW_GRANTS", // MySQL and generic dialects only
  "SHOW_INDEX", // MySQL and generic dialects only
  "SHOW_MASTER", // MySQL and generic dialects only
  "SHOW_OPEN", // MySQL and generic dialects only
  "SHOW_PLUGINS", // MySQL and generic dialects only
  "SHOW_PRIVILEGES", // MySQL and generic dialects only
  "SHOW_PROCEDURE", // MySQL and generic dialects only
  "SHOW_PROCESSLIST", // MySQL and generic dialects only
  "SHOW_PROFILE", // MySQL and generic dialects only
  "SHOW_PROFILES", // MySQL and generic dialects only
  "SHOW_RELAYLOG", // MySQL and generic dialects only
  "SHOW_REPLICAS", // MySQL and generic dialects only
  "SHOW_SLAVE", // MySQL and generic dialects only
  "SHOW_REPLICA", // MySQL and generic dialects only
  "SHOW_STATUS", // MySQL and generic dialects only
  "SHOW_TABLE", // MySQL and generic dialects only
  "SHOW_TABLES", // MySQL and generic dialects only
  "SHOW_TRIGGERS", // MySQL and generic dialects only
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

export default function validation(input: string) {
  const sqlQueries = extractSQLQueries(input);

  if (sqlQueries.length > 0) {
    alert("SQL query detected!");

    const rules = {
      query: 'required|string'
    };

    for (const query of sqlQueries) {
      const res = identify(query, { strict: false });
      console.log(res[0].type);

      const validation = new Validator({ query }, rules);

      if (validation.fails()) {
        console.log("Validation errors:", validation.errors.all());
        throw new Error(`SQL query of type ${res[0].type} detected: ${query}`);
      } else {
        console.log("SQL query passed validation:", query);
      }
    }
  }
}
