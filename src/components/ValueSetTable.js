import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { fetchValueSets, expandValueSet, lookupCodeSystem, translateConcept } from '../services/fhirService'; // Importamos las funciones del servicio FHIR

const ValueSetTable = ({ serverUrl }) => {
  const [valueSets, setValueSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedValueSet, setExpandedValueSet] = useState({});
  const [visibleExpansions, setVisibleExpansions] = useState({}); // Controla la visibilidad de los conceptos expandidos
  const [loadingExpand, setLoadingExpand] = useState(null); // Para indicar qué ValueSet está expandiendo
  const [lookupResult, setLookupResult] = useState(null);  // Para almacenar el resultado del lookup
  const [showLookupModal, setShowLookupModal] = useState(false);  // Estado para controlar la visibilidad del modal de Lookup
  const [translateResult, setTranslateResult] = useState(null);  // Para almacenar el resultado del translate
  const [showTranslateModal, setShowTranslateModal] = useState(false); // Estado para mostrar el modal del translate

  // Manejar la apertura y cierre de modales
  const handleModalClose = () => setShowLookupModal(false);
  const handleTranslateModalClose = () => setShowTranslateModal(false);
  const handleModalShow = () => setShowLookupModal(true);
  const handleTranslateModalShow = () => setShowTranslateModal(true);

  useEffect(() => {
    if (!serverUrl) {
      // Si no hay servidor seleccionado, limpiamos la tabla
      setValueSets([]);
      setExpandedValueSet({});
      return;
    }

    const loadValueSets = async () => {
      // Limpiamos los resultados previos cuando cambiamos de servidor
      setValueSets([]);
      setExpandedValueSet({});
      setLoading(true);
      try {
        // Llamada al servicio para obtener ValueSets
        const valueSetEntries = await fetchValueSets(serverUrl);
        setValueSets(valueSetEntries);
      } catch (error) {
        console.error('Error fetching ValueSets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadValueSets();
  }, [serverUrl]);

  const handleExpand = async (valueSetUrl) => {
    // Controlamos la visibilidad del ValueSet expandido
    setVisibleExpansions((prev) => ({
      ...prev,
      [valueSetUrl]: !prev[valueSetUrl], // Cambiamos entre mostrar/ocultar
    }));

    if (!visibleExpansions[valueSetUrl]) {
      // Solo cargamos datos de expansión si no está expandido aún
      setLoadingExpand(valueSetUrl);
      try {
        // Llamada al servicio para expandir el ValueSet
        const expandedConcepts = await expandValueSet(valueSetUrl, serverUrl);
        setExpandedValueSet((prev) => ({
          ...prev,
          [valueSetUrl]: expandedConcepts, // Los conceptos expandidos
        }));
      } catch (error) {
        console.error('Error expanding ValueSet:', error);
      } finally {
        setLoadingExpand(null);
      }
    }
  };

  const handleLookup = async (system, code) => {
    if (!serverUrl) return;
    try {
      // Llamada al servicio para hacer $lookup
      const lookupData = await lookupCodeSystem(system, code, serverUrl);
      setLookupResult(lookupData);  // Guardamos el resultado en lookupResult
      handleModalShow();  // Mostramos el modal con los resultados
    } catch (error) {
      console.error('Error performing lookup:', error);
    }
  };

  const handleTranslate = async (code, system, targetSystem) => {
    if (!serverUrl) return;
    try {
      // Llamada al servicio para hacer $translate
      const translateData = await translateConcept(code, system, targetSystem, serverUrl);
      setTranslateResult(translateData); // Guardamos el resultado de translate
      handleTranslateModalShow(); // Mostramos el modal de translate
    } catch (error) {
      console.error('Error performing translate:', error);
    }
  };

  if (!serverUrl) {
    return <p>Por favor selecciona un servidor FHIR primero.</p>;
  }

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visualmente-oculto">Cargando...</span></Spinner>;
  }

  return (
    <div>
      <h3>Listado de ValueSets</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>URI</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {valueSets.map((entry, index) => {
            const valueSet = entry.resource || {};
            return (
              <React.Fragment key={index}>
                <tr>
                  <td>{valueSet.id}</td>
                  <td>{valueSet.url || 'Sin URI'}</td>
                  <td>{valueSet.title || 'Sin Título'}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExpand(valueSet.url)}
                      disabled={loadingExpand === valueSet.url}
                    >
                      {visibleExpansions[valueSet.url] ? 'Ocultar' : 'Expandir'}
                    </Button>
                  </td>
                </tr>
                {/* Mostrar u ocultar la expansión del ValueSet si está visible */}
                {visibleExpansions[valueSet.url] && expandedValueSet[valueSet.url] && (
                  <tr>
                    <td colSpan="4">
                      <h5>Conceptos Expandidos</h5>
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Display</th>
                            <th>System</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expandedValueSet[valueSet.url].map((concept, idx) => (
                            <tr key={idx}>
                              <td>{concept.code}</td>
                              <td>{concept.display}</td>
                              <td>{concept.system}</td>
                              <td>
                                {/* Botón para hacer Lookup */}
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleLookup(concept.system, concept.code)}
                                >
                                  Lookup
                                </Button>{' '}
                                {/* Dropdown para hacer Translate */}
                                <DropdownButton
                                  id="dropdown-basic-button"
                                  title="Translate"
                                  variant="success"
                                  size="sm"
                                >
                                  <Dropdown.Item
                                    onClick={() => handleTranslate(concept.code, concept.system, 'http://snomed.info/sct')}
                                  >
                                    Translate to SNOMED CT
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => handleTranslate(concept.code, concept.system, 'http://hl7.org/fhir/sid/icd-10')}
                                  >
                                    Translate to CIE-10
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => handleTranslate(concept.code, concept.system, 'http://hl7.org/fhir/sid/icd-11')}
                                  >
                                    Translate to CIE-11
                                  </Dropdown.Item>
                                </DropdownButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>

      {/* Modal para mostrar el resultado del Lookup */}
      <Modal show={showLookupModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado de Lookup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {lookupResult ? (
            <pre>{JSON.stringify(lookupResult, null, 2)}</pre>
          ) : (
            <p>No hay resultados de lookup.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para mostrar el resultado de Translate */}
      <Modal show={showTranslateModal} onHide={handleTranslateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado de Translate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translateResult ? (
            <pre>{JSON.stringify(translateResult, null, 2)}</pre>
          ) : (
            <p>No hay resultados de translate.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTranslateModalClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ValueSetTable;
