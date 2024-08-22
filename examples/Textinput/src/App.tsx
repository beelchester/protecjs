import { useState } from 'react';
import './App.css';
import { TextInput, validation } from 'protecjs';

function App() {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (input: string) => {
    try {
      validation(input); // Call the validation function
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
<<<<<<< HEAD
      <TextInput value={text} onChange={handleChange}
=======
      <TextInput value={text} onChange={setText}
>>>>>>> f86fd5072b5f62379e3f5d1e94d152d2ad436a88
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
  )
}

export default App;
