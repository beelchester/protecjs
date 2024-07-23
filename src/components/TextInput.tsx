import React from 'react';
import BaseElement from './BaseElement';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  dompurify?: {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
    ALLOW_DATA_ATTR?: boolean;
    ALLOW_UNKNOWN_PROTOCOLS?: boolean;
    USE_PROFILES?: { [profile: string]: boolean };
    SANITIZE_DOM?: boolean;
    KEEP_CONTENT?: boolean;
    RETURN_TRUSTED_TYPE?: boolean;
  };
  [key: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, dompurify, ...props }) => {
  return <BaseElement tag="input" type="text" value={value} onChange={onChange} dompurify={dompurify} {...props} />;
};

export default TextInput;
