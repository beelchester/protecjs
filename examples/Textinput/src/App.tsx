import { useState } from 'react';
import './App.css';
import { TextInput } from 'protecjs';
import {validation}  from 'protecjs'; // <--- Import the validator function

function App() {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true); // Add a state to track validation result

  const handleInputChange = (input: string) => {
    setText(input);
    const validationResult = validation(input);
    setIsValid(validationResult === undefined); // Set isValid to true if no error is thrown
  };

  return (
    <div>
      <TextInput value={text} onChange={handleInputChange}
        dompurify={{
          ALLOWED_TAGS: ['i', 'em', 'strong', 'a'],
          ALLOWED_ATTR: ['href'],
          FORBID_TAGS: ['script'],
          FORBID_ATTR: ['onclick'],
        }}
      />
      <p>Sanitized Text: {text}</p>
      {isValid ? (
        <p>Input is valid!</p>
      ) : (
        <p style={{ color: 'red' }}>Input is not valid!</p>
      )}
    </div>
  );
}

export default App;