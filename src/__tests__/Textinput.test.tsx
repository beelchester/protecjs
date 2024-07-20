import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput  from '../components/TextInput';

test('renders input', () => {
  render(<TextInput value="" onChange={() => {}} />);
  const inputElement = screen.getByRole('textbox');
  expect(inputElement).toBeInTheDocument();
});

test('prints input', () => {
  const handleChange = jest.fn();
  render(<TextInput value="" onChange={handleChange} />);
  const inputElement = screen.getByRole('textbox');

  fireEvent.change(inputElement, { target: { value: 'Test' } });
  expect(inputElement).toHaveValue('Test');
  expect(handleChange).toHaveBeenCalledWith('Test');
});

test('sanitizes various inputs with DOMPurify', () => {
  const handleChange = jest.fn();
  render(<TextInput value="" onChange={handleChange} />);
  const inputElement = screen.getByRole('textbox');

  const testCases = [
    {input : '<img src=x onerror=alert(1)//>' , expected : '<img src="x">' },
    { input: '<script>alert("XSS")</script>', expected: '' },
    { input: '<a href="javascript:alert(1)">Click me</a>', expected: '<a>Click me</a>' },
    { input: '<div onclick="alert(1)">Hello</div>', expected: '<div>Hello</div>' },
    { input: '<img src="x" onerror="alert(1)" />', expected: '<img src="x">' },
    { input: '<img src=x onerror=alert(1)//>', expected: '<img src="x">' },
    { input: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>', expected: '<p>abc</p>' },
    { input: '<math><mi//xlink:href="data:x,<script>alert(4)</script>">', expected: '<math><mi></mi></math>' },
    { input: '<TABLE><tr><td>HELLO</tr></TABLE>', expected: '<table><tbody><tr><td>HELLO</td></tr></tbody></table>' },
    { input: '<UL><li><A HREF=//google.com>click</UL>', expected: '<ul><li><a href="//google.com">click</a></li></ul>' },
    { input: '<style onload=\'alert(1)\'>body{color:red;}</style>', expected: '<style>body{color:red;}</style>' },
    { input: '<svg><script xlink:href="data:application/javascript;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4="></script></svg>', expected: '<svg></svg>' },
    { input: '<object data="javascript:alert(1)">Click me</object>', expected: '<object data="about:blank">Click me</object>' },
    { input: '<a href=\'javascript:alert(1)\'>Click me</a>', expected: '<a href="">Click me</a>' },
    { input: '<svg><g/onload=alert(1)//<p><animate/onbegin=alert(2)//><style>@import\'javascript:alert(3)\';</style>', expected: '<svg><g><p><animate></animate><style></style></p></g></svg>' },
    { input: '<svg><g/onload=alert(2)//<p><style>@import\'javascript:alert(3)\';</style>', expected: '<svg><g><p><style></style></p></g></svg>' },
    { input: '<div id=\'a\' style=\'xpression(alert(1))\'>X</div>', expected: '<div id="a">X</div>' },
    { input: '<iframe src="javascript:alert(1)"></iframe>', expected: '<iframe src="about:blank"></iframe>' },
    { input: '<style>@keyframes x{}</style><img src=\'x\' onerror=\'alert(1)\'>', expected: '<style>@keyframes x{}</style><img src="x">' },
    { input: '<input type=\'text\' value=\'\'><img src=\'x\' onerror=\'alert(1)\'>', expected: '<input value="\'\'" type="\'text\'"><img src="\'x\'">' },
    { input: 'Hello <b>World</b>', expected: 'Hello <b>World</b>' },
  ];

  testCases.forEach(({ input, expected }) => {
    fireEvent.change(inputElement, { target: { value: input } });
    expect(inputElement).toHaveValue(expected);
    expect(handleChange).toHaveBeenCalledWith(expected);
  });
});
