import React, { useState } from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from '../components/TextInput';
import fs from 'fs';
import path from 'path';

interface TestCase {
  input: string;
  expected: string;
}

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

  const testCasesPath = path.join(__dirname, 'dompurifyTests.json');
  const testCases: TestCase[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));

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

<<<<<<< HEAD
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
=======
  const testCasesPath = path.join(__dirname, 'dompurifyConfigTests.json');
  const testCases: TestCase[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));
>>>>>>> upstream/master

  testCases.forEach(({ input, expected }) => {
    fireEvent.change(inputElement, { target: { value: input } });
    expect(inputElement).toHaveValue(expected);
    expect(handleChange).toHaveBeenCalledWith(expected);
  });
});

