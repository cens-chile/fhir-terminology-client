import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const ServerSelector = ({ onSelectServer }) => {
  const [selectedServer, setSelectedServer] = useState('Seleccionar servidor FHIR');

  const servers = [
    { name: 'Local FHIR Server', url: 'http://localhost:8180/fhir' },
    { name: 'Hapi FHIR Server UHN', url: '	http://hapi.fhir.org/baseR4' },
    { name: 'Snowstorm Chile', url: 'http://15.228.12.79:8180/fhir' },
    { name: 'Snowstorm Suriname', url: 'http://186.179.201.48:8180/fhir' },
    { name: 'Snowstorm Costa Rica', url: 'http://201.191.3.209:8180/fhir' },
    { name: 'Snowstorm Barbados', url: 'https://superb-corgi-firstly.ngrok-free.app/fhir'}
  ];

  const handleSelect = (serverUrl) => {
    setSelectedServer(serverUrl);
    onSelectServer(serverUrl);  // Pasar el servidor seleccionado al componente principal
  };

  return (
    <DropdownButton
      id="fhir-server-selector"
      title={selectedServer}
      onSelect={handleSelect}
      variant="info"
      className="mb-4"
    >
      {servers.map((server, index) => (
        <Dropdown.Item key={index} eventKey={server.url}>
          {server.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default ServerSelector;
