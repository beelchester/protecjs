import React, { useState } from 'react';
import DOMPurify from 'dompurify';

interface BaseElementProps {
  tag: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

const BaseElement: React.FC<BaseElementProps> = ({ tag: Tag, value, onChange, ...props }) => {
  const handleChange = (event: React.ChangeEvent<any>) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    console.log(sanitizedValue);
    onChange(sanitizedValue);
  };

  return <Tag {...props} value={value} onChange={handleChange} />;
};

export default BaseElement;
