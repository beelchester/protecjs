import { useState } from 'react';
import './App.css';
import { TextInput } from 'protecjs';

function App() {
  const [text, setText] = useState('');
  return (
    <div>
      <TextInput value={text} onChange={setText} />
      <p>Sanitized Text: {text}</p>
    </div>
  )
}

export default App
