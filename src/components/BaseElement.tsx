import React from 'react';
import DOMPurify from 'dompurify';
import DomPurifyConfig from './dompurifyConfig';

interface BaseElementProps {
  tag: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (value: string) => void;
  dompurify?: DomPurifyConfig;
  [key: string]: any;
}

const BaseElement: React.FC<BaseElementProps> = ({ tag: Tag, value, onChange, dompurify, ...props }) => {
  const handleChange = (event: React.ChangeEvent<any>) => {
    const sanitized = DOMPurify.sanitize(event.target.value, dompurify || {});
    if (sanitized !== event.target.value) {
      //TODO: Send log here
    }

    const sanitizedValue = typeof sanitized === 'string' ? sanitized : sanitized.toString();

    onChange(sanitizedValue);
  };

  return <Tag {...props} value={value} onChange={handleChange} />;
};

export default BaseElement;
