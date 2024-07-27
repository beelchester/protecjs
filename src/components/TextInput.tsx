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
    SAFE_FOR_JQUERY?: boolean;
    SAFE_FOR_TEMPLATES?: boolean;
    WHOLE_DOCUMENT?: boolean;
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
    RETURN_DOM_IMPORT?: boolean;
    IN_PLACE?: boolean;
    ALLOW_ARIA_ATTR?: boolean;
    ADD_TAGS?: string[];
    ADD_ATTR?: string[];
    FORBID_CONTENTS?: string[]; 
    NAMESPACE?: string;
    FORCE_BODY?: boolean;
    FORBID_CSS?: boolean;
    ALLOW_CSS_CLASSES?: string[];
    SAFE_FOR_TWITTER?: boolean;
  };
  [key: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, dompurify, ...props }) => {
  return <BaseElement tag="input" type="text" value={value} onChange={onChange} dompurify={dompurify} {...props} />;
};

export default TextInput;