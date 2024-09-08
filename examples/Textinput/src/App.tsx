import { useState } from 'react';
import { HelmetProvider, CSPMeta, TextInput, validation } from 'protecjs';

function App() {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (input: string) => {
    try {
      validation(input, { sql: true });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setText(input);
  };

  return (
    <HelmetProvider>
      <CSPMeta 
        policy="default-src 'self'; script-src 'self' https://apis.google.com"
        additionalMetaTags={[
          { name: "description", content: "A React app with CSP and validation" },
          { name: "author", content: "Your Name" },
          { property: "og:title", content: "My React App" }
        ]}
      />
      <div>
        <TextInput value={text} onChange={handleChange}
          dompurify={{
            ALLOWED_TAGS: ['i', 'em', 'strong', 'a'],
            ALLOWED_ATTR: ['href'],
            FORBID_TAGS: ['script'],
            FORBID_ATTR: ['onclick'],
          }}
        />
        <p>Sanitized Text: {text}</p>
        {isValid ? (
          <p>Input is valid</p>
        ) : (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;