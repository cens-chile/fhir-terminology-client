import React, { useState } from 'react';
import { fetchResourceById } from '../services/fhirService';
import SearchBar from '../components/SearchBar';
import Results from '../components/Results';

const ConceptMapPage = ({ serverUrl }) => {
  const [data, setData] = useState(null);

  const handleSearch = async (searchType, searchValue) => {
    if (!serverUrl) {
      alert("Por favor selecciona un servidor FHIR primero");
      return;
    }

    try {
      let result;

      // Buscar según el tipo (ID, URL, Title)
      if (searchType === 'ID') {
        result = await fetchResourceById('ConceptMap', searchValue, serverUrl);
      } else if (searchType === 'URL') {
        const response = await fetch(`${serverUrl}/ConceptMap?url=${encodeURIComponent(searchValue)}`, {
          headers: { 'Accept': 'application/fhir+json' }
        });
        result = await response.json();
      } else if (searchType === 'Title') {
        const response = await fetch(`${serverUrl}/ConceptMap?name=${encodeURIComponent(searchValue)}`, {
          headers: { 'Accept': 'application/fhir+json' }
        });
        result = await response.json();
      }

      setData(result);
    } catch (error) {
      console.error(`Error buscando ConceptMap:`, error);
    }
  };

  return (
    <div>
      <h2>Buscar ConceptMap</h2>
      <SearchBar onSearch={handleSearch} />
      {data && <Results data={data} />}
    </div>
  );
};

export default ConceptMapPage;
