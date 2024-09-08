import React from 'react';
import { Helmet, HelmetProvider as Provider } from 'react-helmet-async';

interface CSPMetaProps {
  policy: string;
}

const CSPMeta: React.FC<CSPMetaProps> = ({ policy }) => {
  return (
    <Helmet>
      <meta http-equiv="Content-Security-Policy" content={policy} />
    </Helmet>
  );
};

export const HelmetProvider = Provider;
export default CSPMeta;