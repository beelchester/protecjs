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
