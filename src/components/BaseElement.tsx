import React from 'react';
import DOMPurify from 'dompurify';

interface BaseElementProps {
  tag: keyof JSX.IntrinsicElements;
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

const BaseElement: React.FC<BaseElementProps> = ({ tag: Tag, value, onChange, dompurify, ...props }) => {
  const handleChange = (event: React.ChangeEvent<any>) => {
    console.log(dompurify)
   
    const sanitizedValue = DOMPurify.sanitize(event.target.value, dompurify || {});

    onChange(sanitizedValue);
    
  };

  return <Tag {...props} value={value} onChange={handleChange} />;
};

export default BaseElement;
