import React from 'react';
import BaseElement from './BaseElement';
import DOMPurify from 'dompurify';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  dompurifyConfig?: DOMPurify.Config;
  [key: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, dompurifyConfig, ...props }) => {
  return (
    <BaseElement
      tag="input"
      type="text"
      value={value}
      onChange={onChange}
      dompurifyConfig={dompurifyConfig} 
      {...props}
    />
  );
};

export default TextInput;
