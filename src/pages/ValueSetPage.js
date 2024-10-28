import React from 'react';
import ValueSetTable from '../components/ValueSetTable';

const ValueSetPage = ({ serverUrl }) => {
  return (
    <div>
      <ValueSetTable serverUrl={serverUrl} />
    </div>
  );
};

export default ValueSetPage;
