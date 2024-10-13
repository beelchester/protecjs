import { useState } from 'react';
import './App.css';
import { TextInput, validate } from 'protecjs';

function App() {
  const [sqlText, setSqlText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [rtmpText, setRtmpText] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('');
  const [isSqlValid, setIsSqlValid] = useState(true);
  const [isUrlValid, setUrlIsValid] = useState(true);
  const [isEmailValid, setEmailIsValid] = useState(true);
  const [isCustomPasswordValid, setCustomPasswordIsValid] = useState(true);
  const [isDefaultPasswordValid, setDefaultPasswordIsValid] = useState(true);

  const [sqlErrorMessage, setSqlErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [urlErrorMessage, setUrlErrorMessage] = useState('');
  const [customPassErrorMessage, setCustomPassErrorMessage] = useState('');
  const [defaultPassErrorMessage, setDefaultPassErrorMessage] = useState('');

  const handleSqlChange = (input: string) => {
    try {
      validate(input, { sql: true });
      setIsSqlValid(true);
      setSqlErrorMessage('');
    } catch (error: any) {
      setIsSqlValid(false);
      setSqlErrorMessage(error.message);
    }
    setSqlText(input);
  };

  const handleEmailChange = (input: string) => {
    try {
      validate(input, { text: { validator: 'isEmail' } });
      setEmailIsValid(true);
      setEmailErrorMessage('');
    } catch (error: any) {
      setEmailIsValid(false);
      setEmailErrorMessage(error.message);
    }
    setEmailText(input);
  };

  const handleRtmpChange = (input: string) => {
    //    valid: 'rtmp://foobar.com'
    //    invalid: 'http://foobar.com'
    try {
      validate(input, { text: { validator: 'isURL', args: { protocols: ['rtmp'] } } });
      setUrlIsValid(true);
      setUrlErrorMessage('');
    } catch (error: any) {
      setUrlIsValid(false);
      setUrlErrorMessage(error.message);
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
      setCustomPasswordIsValid(true);
      setCustomPassword("");
    } catch (error: any) {
      setCustomPasswordIsValid(false);
      setCustomPassErrorMessage(error.message);
    }
    setCustomPassword(input);
  };

  const handleDefaultPasswordChange = (input: string) => {
    // defaultRules: { minLength: 8, uppercase: 1, lowercase: 1, digits: 1, symbols: 1, spaces: 0 };
    try {
      validate(input, { password: { default: true } });
      setDefaultPasswordIsValid(true);
      setDefaultPassword("");
    } catch (error: any) {
      setDefaultPasswordIsValid(false);
      setDefaultPassErrorMessage(error.message);
    }
    setDefaultPassword(input);
  };

  return (
    <div>
      <h3> XSS sanitization with SQL injection validation</h3>
      <TextInput value={sqlText} onChange={handleSqlChange} />
      {isSqlValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{sqlErrorMessage}</p>
      )}
      <h3> XSS sanitization with Text validation (email)</h3>
      <TextInput value={emailText} onChange={handleEmailChange} />
      {isEmailValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{emailErrorMessage}</p>
      )}
      <h3> XSS sanitization with Text validation (rtmp url)</h3>
      <TextInput value={rtmpText} onChange={handleRtmpChange} />
      {isUrlValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{urlErrorMessage}</p>
      )}
      <h3> XSS sanitization with Custom password validation</h3>
      <TextInput value={customPassword} onChange={handlePasswordChange} />
      {isCustomPasswordValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{customPassErrorMessage}</p>
      )}
      <h3> XSS sanitization with Default password validation</h3>
      <TextInput value={defaultPassword} onChange={handleDefaultPasswordChange} />
      {isDefaultPasswordValid ? (
        <p>Input is valid</p>
      ) : (
        <p style={{ color: 'red' }}>{defaultPassErrorMessage}</p>
      )}
    </div>
  );
}

export default App;
