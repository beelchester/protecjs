import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from '../components/TextInput';
import DOMPurify from 'dompurify';

const handleChange = jest.fn();

interface DOMPurifyConfig {
  ALLOWED_TAGS: string[];
  ALLOWED_ATTR: string[];
  FORBID_TAGS: string[];
  FORBID_ATTR: string[];
  ALLOW_DATA_ATTR: boolean;
  ALLOW_UNKNOWN_PROTOCOLS: boolean;
  USE_PROFILES: { [profile: string]: boolean };
  SANITIZE_DOM: boolean;
  KEEP_CONTENT: boolean;
  RETURN_TRUSTED_TYPE: boolean;
}

const Wrapper = ({ dompurifyConfig }: { dompurifyConfig?: DOMPurifyConfig }) => {
  const [value, setValue] = React.useState('');
  const onChange = (newValue: string) => {
    setValue(newValue);
    handleChange(newValue);
  };

  const sanitizedValue = React.useMemo(() => {
    if (dompurifyConfig) {
      return DOMPurify.sanitize(value, dompurifyConfig);
    } else {
      return value;
    }
  }, [value, dompurifyConfig]);

  return <TextInput value={sanitizedValue} onChange={onChange} dompurifyConfig={dompurifyConfig} />;
};

test('renders input', () => {
  render(<Wrapper />);
  const inputElement = screen.getByRole('textbox');
  expect(inputElement).toBeInTheDocument();
});

test('prints input', () => {
  render(<Wrapper />);
  const inputElement = screen.getByRole('textbox');

  fireEvent.change(inputElement, { target: { value: 'Test' } });
  expect(inputElement).toHaveValue('Test');
  expect(handleChange).toHaveBeenCalledWith('Test');
});

test('sanitizes input', () => {
  render(<Wrapper />);
  const inputElement = screen.getByRole('textbox');

  fireEvent.change(inputElement, { target: { value: '<img src=x onerror=alert(1)//>' } });
  const expectedValue = '<img src="x">';
  expect(inputElement).toHaveValue(expectedValue);
  expect(handleChange).toHaveBeenCalledWith(expectedValue);
});

test('sanitizes various inputs with DOMPurify', () => {
  render(<Wrapper />);
  const inputElement = screen.getByRole('textbox');

  const testCases = [
    { input: '<script>alert("XSS")</script>', expected: '' },
    { input: '<a href="javascript:alert(1)">Click me</a>', expected: '<a>Click me</a>' },
    { input: '<div onclick="alert(1)">Hello</div>', expected: '<div>Hello</div>' },
    { input: '<img src="x" onerror="alert(1)" />', expected: '<img src="x">' },
    { input: '<img src=x onerror=alert(1)//>', expected: '<img src="x">' },
    { input: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>', expected: '<p>abc</p>' },
    { input: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">', expected: '<math><mi></mi></math>' },
    { input: '<TABLE><tr><td>HELLO</tr></TABLE>', expected: '<table><tbody><tr><td>HELLO</td></tr></tbody></table>' },
    { input: '<UL><li><A HREF=//google.com>click</UL>', expected: '<ul><li><a href="//google.com">click</a></li></ul>' },
    { input: '<svg><script xlink:href="data:application/javascript;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4="></script></svg>', expected: '<svg></svg>' },
    { input: '<a href=\'javascript:alert(1)\'>Click me</a>', expected: '<a>Click me</a>' },
    { input: '<input type=\'text\' value=\'\'><img src=\'x\' onerror=\'alert(1)\'>', expected: '<input value="" type="text"><img src="x">' },
  ];

  testCases.forEach(({ input, expected }) => {
    fireEvent.change(inputElement, { target: { value: input } });
    const lastCallArgs = handleChange.mock.calls.slice(-1)[0];
    const sanitizedValue = lastCallArgs[0];
    
    if (typeof sanitizedValue === 'string') {
      expect(inputElement).toHaveValue(expected);
      expect(handleChange).toHaveBeenCalledWith(expected);
    } else if (typeof sanitizedValue === 'object' && sanitizedValue.toString) {
      const trustedHTMLString = sanitizedValue.toString();
      expect(trustedHTMLString).toEqual(expected);
      expect(handleChange).toHaveBeenCalledWith(trustedHTMLString);
    } else {
      fail('Unexpected return type from handleChange');
    }
  });
});

test('uses dompurifyConfig to sanitize input', () => {
  const dompurifyConfig: DOMPurifyConfig = {
    ALLOWED_TAGS: ['a', 'b', 'strong', 'i', 'em', 'p', 'div', 'img', 'ul', 'li', 'table', 'tr', 'td', 'math', 'mi'],
    ALLOWED_ATTR: ['href', 'title', 'alt'],
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: ['style', 'onclick'],
    ALLOW_DATA_ATTR: true,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    USE_PROFILES: { html: true },
    SANITIZE_DOM: true,
    KEEP_CONTENT: false,
    RETURN_TRUSTED_TYPE: true, 
  };

  render(<Wrapper dompurifyConfig={dompurifyConfig} />);
  const inputElement = screen.getByRole('textbox');

  fireEvent.change(inputElement, { target: { value: '<script>alert("XSS")</script>' } });

  const expectedValue = '';
  expect(inputElement).toHaveValue(expectedValue);
  expect(handleChange).toHaveBeenCalledWith(expectedValue);
});
