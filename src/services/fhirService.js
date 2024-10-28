import axios from 'axios';

// Obtener un recurso por ID
export const fetchResourceById = async (resourceType, id, serverUrl) => {
  try {
    const response = await axios.get(`${serverUrl}/${resourceType}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resourceType}:`, error);
    throw error;
  }
};

// Obtener un recurso por URL o Title
export const fetchResourceByUrlOrTitle = async (resourceType, queryParam, queryValue, serverUrl) => {
  try {
    const response = await axios.get(`${serverUrl}/${resourceType}?${queryParam}=${encodeURIComponent(queryValue)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resourceType}:`, error);
    throw error;
  }
};

// Obtener todos los ValueSets
export const fetchValueSets = async (serverUrl) => {
  try {
    const response = await axios.get(`${serverUrl}/ValueSet`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json',
      },
    });
    return response.data.entry || [];
  } catch (error) {
    console.error('Error fetching ValueSets:', error);
    throw error;
  }
};

// Expandir un ValueSet
export const expandValueSet = async (valueSetUrl, serverUrl) => {
  try {
    const response = await axios.get(`${serverUrl}/ValueSet/$expand?url=${encodeURIComponent(valueSetUrl)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json',
      },
    });
    return response.data.expansion.contains || [];
  } catch (error) {
    console.error('Error expanding ValueSet:', error);
    throw error;
  }
};

// Hacer $lookup en un CodeSystem
export const lookupCodeSystem = async (system, code, serverUrl) => {
  try {
    console.log('aaaaaaaaaaaaaaaaa');
    const response = await axios.get(`${serverUrl}/CodeSystem/$lookup?system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json',
        'Accept-Language': 'es-ES'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error performing lookup:', error);
    throw error;
  }
};

// Hacer $translate usando axios.get
export const translateConcept = async (code, system, targetSystem, serverUrl) => {
  try {
    console.log('bbbbbb');
    const response = await axios.get(`${serverUrl}/ConceptMap/$translate?code=${encodeURIComponent(code)}&system=${encodeURIComponent(system)}&targetsystem=${encodeURIComponent(targetSystem)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/fhir+json',
        'Accept-Language': 'es-ES'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error performing translate:', error);
    throw error;
  }
};
