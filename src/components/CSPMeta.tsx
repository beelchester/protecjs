import React from 'react';
import { Helmet, HelmetProvider as Provider } from 'react-helmet-async';

interface MetaTag {
  name?: string;
  httpEquiv?: string;
  property?: string;
  content: string;
}

interface CSPMetaProps {
  policy: string;
  additionalMetaTags?: MetaTag[];
}

const CSPMeta: React.FC<CSPMetaProps> = ({ policy, additionalMetaTags = [] }) => {
  return (
    <Helmet>
      <meta httpEquiv="Content-Security-Policy" content={policy} />
      {additionalMetaTags.map((tag, index) => (
        <meta
          key={index}
          name={tag.name}
          httpEquiv={tag.httpEquiv}
          property={tag.property}
          content={tag.content}
        />
      ))}
    </Helmet>
  );
};

export { Provider as CSPHelmet };
export default CSPMeta;
