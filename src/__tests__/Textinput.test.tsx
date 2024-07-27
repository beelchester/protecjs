import React, { useState } from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from '../components/TextInput';

afterEach(cleanup);
const handleChange = jest.fn();
const Wrapper = ({ dompurifyConfig }: { dompurifyConfig?: { [key: string]: any } }) => {
  const [value, setValue] = useState('');
  const onChange = (newValue: string) => {
    setValue(newValue);
    handleChange(newValue);
  };
  return <TextInput value={value} onChange={onChange} dompurify={dompurifyConfig} />;
};

test('renders input', () => {
  render(<TextInput value="" onChange={() => { }} />);
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

test('sanitizes various inputs with DOMPurify', () => {
  render(<Wrapper />);
  const inputElement = screen.getByRole('textbox');

  const testCases = [
    { input: '<img src=x onerror=alert(1)//>', expected: '<img src="x">' },
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
    expect(inputElement).toHaveValue(expected);
    expect(handleChange).toHaveBeenCalledWith(expected);
  });
});

test('sanitizes input as per the dompurifyConfig', () => {
  render(
    <Wrapper
      dompurifyConfig={{
        ALLOWED_TAGS: ['em', 'strong', 'a'],
        ALLOWED_ATTR: ['href'],
        FORBID_TAGS: ['script'],
        FORBID_ATTR: ['onclick'],
        ALLOW_ARIA_ATTR: true,
        FORCE_BODY: true,
        FORBID_CSS: false,
        ALLOW_CSS_CLASSES: ['class1', 'class2'],
        SAFE_FOR_TWITTER: true,
        IN_PLACE: true,

      }}
    />
  );
  const inputElement = screen.getByRole('textbox');

  const testCases = [
    { input: '<b>Bold</b>', expected: 'Bold' },
    { input: '<i>Italic</i>', expected: 'Italic' },
    { input: '<em>Emphasis</em>', expected: '<em>Emphasis</em>' },
    { input: '<strong>Strong</strong>', expected: '<strong>Strong</strong>' },
    { input: '<a href="http://example.com">Link</a>', expected: '<a href="http://example.com">Link</a>' },
    { input: '<script>alert("XSS")</script>', expected: '' },
    { input: '<div>Hello</div>', expected: 'Hello' },
    { input: '<marquee>Hello world</marquee>', expected: 'Hello world' },
    { input: '<div aria-label="Test">Content</div>', expected: 'Content' },
    { input: '<html><body>Hello</body></html>', expected: 'Hello' },
    { input: '<a href="http://example.com">Link</a>', expected: '<a href="http://example.com">Link</a>' },
    { input: '<html><body><p>Paragraph</p></body></html>', expected: 'Paragraph' },
  ];

  testCases.forEach(({ input, expected }) => {
    fireEvent.change(inputElement, { target: { value: input } });
    expect(inputElement).toHaveValue(expected);
    expect(handleChange).toHaveBeenCalledWith(expected);
  });
});

