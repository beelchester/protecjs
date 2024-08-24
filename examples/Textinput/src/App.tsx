import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = (input: string) => {
    if (input.includes('<') || input.includes('>')) {
      throw new Error('Invalid input: HTML tags are not allowed.');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    try {
      validateInput(input); 
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
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Enter text"
      />
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
