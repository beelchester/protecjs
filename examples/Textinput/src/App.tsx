import { useState } from 'react';
import './App.css';
import { TextInput, validate } from 'protecjs';

function App() {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const rules = {
    text: { min: 5, max: 100 }
  };

  const handleChange = (input: string) => {
    try {
      // validation(input);
      // validation(input, { sql: false });
      validate(input, { sql: true }, rules);
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setText(input);
  };

  return (
    <div>
      <TextInput value={text} onChange={handleChange} />
      <p>Sanitized Text: {text}</p>
      {isValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}
    </div>
  );
}

export default App;
