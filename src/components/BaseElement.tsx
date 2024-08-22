import React from 'react';
import DOMPurify from 'dompurify';
import DomPurifyConfig from './dompurifyConfig';

interface BaseElementProps {
  tag: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (value: string) => void;
<<<<<<< HEAD
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
=======
  dompurify?: DomPurifyConfig;
>>>>>>> upstream/master
  [key: string]: any;
}

const BaseElement: React.FC<BaseElementProps> = ({ tag: Tag, value, onChange, dompurify, ...props }) => {
  const handleChange = (event: React.ChangeEvent<any>) => {
<<<<<<< HEAD
<<<<<<< HEAD
    console.log(dompurify)
   
    const sanitizedValue = DOMPurify.sanitize(event.target.value, dompurify || {});
=======
    const sanitized = DOMPurify.sanitize(event.target.value, dompurify || {});

    const sanitizedValue = typeof sanitized === 'string' ? sanitized : sanitized.toString();
>>>>>>> upstream/master

=======
    const sanitizedValue = DOMPurify.sanitize(event.target.value, dompurify || {});
>>>>>>> f86fd5072b5f62379e3f5d1e94d152d2ad436a88
    onChange(sanitizedValue);
  };

  return <Tag {...props} value={value} onChange={handleChange} />;
};

export default BaseElement;
