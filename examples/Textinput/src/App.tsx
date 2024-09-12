import React, { useState } from 'react';
import './App.css';
import validation  from 'protecjs';

function App() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const rules = {
    text: { min: 5, max: 100 }
  };

  const passwordRules = {
    minLength: 8,
    uppercase: 1,
    lowercase: 1,
    digits: 1,
    symbols: 1,
    spaces: 0,
  };

  // Existing validateInput function, untouched
  const validateInput = (input: string) => {
    if (input.includes('<') || input.includes('>')) {
      throw new Error('Invalid input: HTML tags are not allowed.');
    }

    const { min, max } = rules.text;
    if (input.length < min || input.length > max) {
      throw new Error(`Input must be between ${min} and ${max} characters.`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    try {
      // validation(input);
      // validation(input, { sql: false });
      validation(input, { sql: true });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setText(input); 
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    try {
      validation(input, { type: 'password' }, {}, passwordRules);
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setPassword(input);
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Enter text"
      />
      <p>Sanitized Text: {text}</p>

      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter password"
      />
      {isValid ? (
        <p>Password is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}
    </div>
  );
}

export default App;
