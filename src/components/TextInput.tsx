import React from 'react';
import BaseElement from './BaseElement';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, ...props }) => {
  return <BaseElement tag="input" type="text" value={value} onChange={onChange} {...props} />;
};

export default TextInput;
