import React from 'react';
import BaseElement from './BaseElement';
import DomPurifyConfig from './dompurifyConfig';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  dompurify?: DomPurifyConfig;
  [key: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, dompurify, ...props }) => {
  return <BaseElement tag="input" type="text" value={value} onChange={onChange} dompurify={dompurify} {...props} />;
};

export default TextInput;
