# ProtecJS

Client-side attack protection React library

# Contribute

Build protecjs:
```bash
yarn
yarn build
```

Run example:
```bash
cd examples/Textinput
yarn
yarn dev
```

# Documentation

## TextInput

The TextInput component is a controlled input field designed for React applications. It integrates with DOMPurify to sanitize user input, ensuring that potentially harmful content is removed before being processed or displayed. This component helps in preventing Cross-Site Scripting (XSS) attacks by cleaning up the input based on the provided or default sanitization rules.


Syntax
```bash
<TextInput
  value={value}
  onChange={onChange}
  dompurify={dompurifyConfig} // Optional
/>
```

Props

- value (string): The current value of the input field. This should be managed by the parent component's state.

- onChange ((newValue: string) => void): A callback function that is triggered when the input value changes.
It receives the new value as a parameter.

- dompurify (object | undefined): Optional configuration object for DOMPurify to customize the sanitization behavior.


DOMPurify Configuration

The dompurify prop allows you to pass a configuration object to customize the sanitization process. 
This object can include various settings such as allowed tags, attributes, and forbidden elements.


Configuration Example
```bash
const dompurifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'], // Tags that are allowed in the input
  FORBID_TAGS: ['style', 'script'],             // Tags that are forbidden
  ALLOWED_ATTR: ['href', 'title', 'alt'],       // Attributes that are allowed on tags
  FORBID_ATTR: ['style', 'onclick'],            // Attributes that are forbidden
  ALLOW_DATA_ATTR: true,                        // Allow data-* attributes
  ALLOW_UNKNOWN_PROTOCOLS: false,               // Disallow unknown protocols in URLs
  USE_PROFILES: { html: true, svg: true, mathMl: true }, // Profiles for sanitization
  SANITIZE_DOM: true,                           // Sanitize the DOM directly
  KEEP_CONTENT: false,                          // Do not keep the content of forbidden tags
  SAFE_FOR_JQUERY: true,                        // Ensure compatibility with jQuery
  SAFE_FOR_TEMPLATES: true,                     // Make the sanitizer safe for template systems
  WHOLE_DOCUMENT: true,                         // Treat the input as a whole document
  RETURN_DOM: false,                            // Return the sanitized DOM as a string
  RETURN_DOM_FRAGMENT: false,                   // Return a document fragment instead of a full document
  RETURN_DOM_IMPORT: false,                     // Do not return the DOM with imports
  IN_PLACE: false,                              // Do not mutate the input element directly
  ALLOW_ARIA_ATTR: true,                        // Allow ARIA attributes
  FORBID_CONTENTS: false,                       // Do not forbid the contents of tags entirely
  FORCE_BODY: true,                             // Force the input to be treated as a body element
  FORBID_CSS: false,                            // Allow CSS properties
  ALLOW_CSS_CLASSES: ['class1', 'class2'],      // Allowed CSS classes
  SAFE_FOR_TWITTER: true                        // Make the sanitizer safe for Twitter
};
```
## Validation
### SQL Injection Validation

Protecjs includes optional SQL validation to guard against SQL injection attacks. By default, this validation is **disabled** but can be enabled if needed. When enabled, it checks input fields for common injection patterns and throws an error if a threat is detected.

SQL injection is a tactic used to manipulate SQL queries by injecting harmful SQL code through input fields. Our validation function identifies and blocks such attempts, protecting your application.

### Usage
To implement SQL validation, use the `validation()` function with your input data. Since SQL validation is off by default, you need to enable it if required.

**Example**
```bash
validation(input, { sql: true });  // SQL validation is enabled
```

## Validation Function
## Overview
The validate function is used to validate different types of inputs including SQL queries, general text, and passwords. This function helps ensure that inputs adhere to specific criteria for security and correctness.

## Function: validate
Purpose: Validate input strings based on their type, including SQL queries, general text, and passwords.
Parameters:
input (string): The text input that is to be validated.
type ('sql' | 'text' | 'password'): The type of validation to perform.

## Usage
## SQL Validation
To validate SQL queries and prevent SQL injection, use the validate function with the 'sql' type.

typescript
Copy code
// Example of validating SQL input
const sqlQuery = "SELECT * FROM users WHERE username = 'admin';";
const isValidSQL = validate(sqlQuery, 'sql');
if (isValidSQL) {
  console.log("SQL query is valid.");
} else {
  console.log("SQL query is invalid.");
}
## Text Validation
For general text validation, such as ensuring the input matches a specific pattern or length, use the 'text' type.

typescript
Copy code
// Example of validating text input
const textInput = "Hello World!";
const isValidText = validate(textInput, 'text');
if (isValidText) {
  console.log("Text input is valid.");
} else {
  console.log("Text input is invalid.");
}
## Password Validation
To validate passwords based on strength criteria, use the 'password' type.

typescript
Copy code
// Example of validating password input
const passwordInput = "P@ssw0rd123";
const isValidPassword = validate(passwordInput, 'password');
if (isValidPassword) {
  console.log("Password is valid.");
} else {
  console.log("Password is invalid.");
}
## Integration Example
Here’s how you can integrate the validate function with a React component, similar to the usage in example/TextInput/src/App.tsx:

typescript
Copy code
import { useState } from 'react';
import './App.css';
import { TextInput } from 'protecjs';
import { validate } from 'protecjs'; // Import the validate function

function App() {
  const [text, setText] = useState('');
  const [isValidText, setIsValidText] = useState(true);

  // Handle text change and validate input
  const handleTextChange = (newText: string) => {
    setText(newText);
    const isValid = validate(newText, 'text');
    setIsValidText(isValid);
  };

  return (
    <div>
      <TextInput 
        value={text} 
        onChange={handleTextChange}
        dompurify={{
          ALLOWED_TAGS: ['i', 'em', 'strong', 'a'],
          ALLOWED_ATTR: ['href'],
          FORBID_TAGS: ['script'],
          FORBID_ATTR: ['onclick'],
        }}
      />
      <p>Sanitized Text: {text}</p>
      {!isValidText && <p style={{ color: 'red' }}>Text input is invalid.</p>}
    </div>
  );
}

export default App;

## Notes
1.Ensure the validate function is imported from the protecjs library.
2.Customize the validation logic to fit specific use cases and security requirements.
3.For additional validation needs, consider extending the validate function or combining it with other libraries.
