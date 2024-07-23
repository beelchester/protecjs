import { useState } from 'react';
import './App.css';
import { TextInput } from 'protecjs';

function App() {
  const [text, setText] = useState('');
  return (
    <div>
      <TextInput value={text} onChange={setText}
        dompurify={{
          ALLOWED_TAGS: ['i', 'em', 'strong', 'a'],
          ALLOWED_ATTR: ['href'],
          FORBID_TAGS: ['script'],
          FORBID_ATTR: ['onclick'],
        }}
      />
      <p>Sanitized Text: {text}</p>
    </div>
  )
}

export default App
