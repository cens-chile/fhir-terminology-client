import React, { useState } from 'react'; // Asegúrate de importar useState
import { Tab, Tabs, Container } from 'react-bootstrap';
import CodeSystemPage from './CodeSystemPage';
import ValueSetPage from './ValueSetPage';
import ConceptMapPage from './ConceptMapPage';
import ServerSelector from '../components/ServerSelector';

const HomePage = () => {
  const [selectedServer, setSelectedServer] = useState(null); // Utilizamos useState correctamente

  const handleSelectServer = (serverUrl) => {
    setSelectedServer(serverUrl);
  };

  return (
    <Container>
      <h1 className="my-4 text-center">FHIR Terminology Client</h1>

      {/* Componente de selección de servidor */}
      <ServerSelector onSelectServer={handleSelectServer} />

      {/* Mostrar el servidor seleccionado */}
      {selectedServer && <p>Servidor seleccionado: {selectedServer}</p>}

      {/* Pestañas de recursos */}
      <Tabs defaultActiveKey="codesystem" id="fhir-tabs" className="mb-3" fill>
        <Tab eventKey="codesystem" title="CodeSystem">
          <CodeSystemPage serverUrl={selectedServer} />
        </Tab>
        <Tab eventKey="valueset" title="ValueSet">
          <ValueSetPage serverUrl={selectedServer} />
        </Tab>
        <Tab eventKey="conceptmap" title="ConceptMap">
          <ConceptMapPage serverUrl={selectedServer} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default HomePage;
