import React from 'react';
import { Card } from 'react-bootstrap';

const Results = ({ data }) => (
  <Card>
    <Card.Body>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card.Body>
  </Card>
);

export default Results;
