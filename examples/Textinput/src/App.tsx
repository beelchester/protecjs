import { useState } from 'react';
import './App.css';
import { TextInput, validate } from 'protecjs';

function App() {
  const [sqlText, setSqlText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [rtmpText, setRtmpText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSqlChange = (input: string) => {
    try {
      validate(input, { sql: true });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setSqlText(input);
  };

  const handleEmailChange = (input: string) => {
    try {
      validate(input, { text: { validator: 'isEmail' } });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setEmailText(input);
  };

  const handleRtmpChange = (input: string) => {
    //    valid: 'rtmp://foobar.com'
    //    invalid: 'http://foobar.com'
    try {
      validate(input, { text: { validator: 'isURL', args: { protocols: ['rtmp'] } } });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setRtmpText(input);
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
      {isValid ? (
        <p>Password is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}
      <h3> XSS sanitization with SQL injection validation</h3>
      <TextInput value={sqlText} onChange={handleSqlChange} />
      <h3> XSS sanitization with Text validation (email)</h3>
      <TextInput value={emailText} onChange={handleEmailChange} />
      <h3> XSS sanitization with Text validation (rtmp url)</h3>
      <TextInput value={rtmpText} onChange={handleRtmpChange} />
    </div>
  );
}

export default App;
