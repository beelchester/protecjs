import React from 'react';
import DOMPurify from 'dompurify';
import DomPurifyConfig from './dompurifyConfig';
import { sendLog } from '../functions/Validation';

interface BaseElementProps {
  tag: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (value: string) => void;
  dompurify?: DomPurifyConfig;
  sendLogsTo?: string;
  [key: string]: any;
}

const BaseElement: React.FC<BaseElementProps> = ({ tag: Tag, value, onChange, dompurify, sendLogsTo, ...props }) => {

  const handleChange = (event: React.ChangeEvent<any>) => {
    const sanitized = DOMPurify.sanitize(event.target.value, dompurify || {});

    const sanitizedValue = typeof sanitized === 'string' ? sanitized : sanitized.toString();

    if (sanitizedValue != event.target.value) {
      if (sendLogsTo) {
        sendLog("xss", "XSS payload detected", sendLogsTo);
      }
    };

    onChange(sanitizedValue);
  };

  return <Tag {...props} value={value} onChange={handleChange} />;
};

export default BaseElement;
