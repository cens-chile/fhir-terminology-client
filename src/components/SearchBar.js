import React, { useState } from 'react';
import { Form, Button, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('ID'); // Tipo de búsqueda (ID, URL, Title)
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchType, searchValue);
    }
  };

  return (
    <Row className="my-3">
      <Col md={3}>
        <DropdownButton id="dropdown-basic-button" title={`Buscar por: ${searchType}`}>
          <Dropdown.Item onClick={() => setSearchType('ID')}>ID</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchType('URL')}>URL</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchType('Title')}>Title</Dropdown.Item>
        </DropdownButton>
      </Col>
      <Col md={6}>
        <Form.Control
          type="text"
          placeholder={`Buscar por ${searchType}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Col>
      <Col md={3}>
        <Button variant="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Col>
    </Row>
  );
};

export default SearchBar;
