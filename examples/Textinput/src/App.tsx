import { useState } from 'react';
import './App.css';
import { TextInput, validate } from 'protecjs';

function App() {
  const [sqlText, setSqlText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [rtmpText, setRtmpText] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('');
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

  const handlePasswordChange = (input: string) => {
    const passwordRules = {
      minLength: 12,
      uppercase: 4,
      lowercase: 4,
      digits: 2,
      symbols: 2,
      spaces: 0
    };
    try {
      validate(input, { password: passwordRules });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setCustomPassword(input);
  };

  const handleDefaultPasswordChange = (input: string) => {
    // defaultRules: { minLength: 8, uppercase: 1, lowercase: 1, digits: 1, symbols: 1, spaces: 0 };
    try {
      validate(input, { password: { default: true } });
      setIsValid(true);
      setErrorMessage('');
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
    }
    setDefaultPassword(input);
  };

  return (
    <div>
      {isValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}
      <h3> XSS sanitization with SQL injection validation</h3>
      <TextInput value={sqlText} onChange={handleSqlChange} />
      <h3> XSS sanitization with Text validation (email)</h3>
      <TextInput value={emailText} onChange={handleEmailChange} />
      <h3> XSS sanitization with Text validation (rtmp url)</h3>
      <TextInput value={rtmpText} onChange={handleRtmpChange} />
      <h3> XSS sanitization with Custom password validation</h3>
      <TextInput value={customPassword} onChange={handlePasswordChange} />
      <h3> XSS sanitization with Default password validation</h3>
      <TextInput value={defaultPassword} onChange={handleDefaultPasswordChange} />
    </div>
  );
}

export default App;
