const fetch = require('node-fetch');

/**
 * Handle an API response.
 * @param {Response} response - An API fetch Response object.
 */
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API request error: ${response.status} - ${response.statusText}. Error body: ${errorBody}`);
  }
  return response.json();
};

/**
 * Fetch Medication Information.
 * @param {string} medicationName - A valid Medication Name.
 * @param {string} apiKey - A valid API Key.
 */
const fetchMedicationInfo = async (medicationName, apiKey) => {
  if (!apiKey || !medicationName.trim()) {
    throw new Error('Invalid Parameters');
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k",
      prompt: `What is ${medicationName}?`,
      max_tokens: 200
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', payload);
    return await handleApiResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request was aborted');
    } else {
      console.error(error);
    }
    throw error;
  }
};

/**
 * Fetch Medication Details from Database
 * @param {string} medicationName - A valid Medication Name.
 */
const fetchMedicationDetailsFromDB = async (medicationName) => {
  if (!medicationName.trim()) {
    throw new Error('Invalid Parameters');
  }

  const payload = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(`http://localhost:3000/medications/${encodeURIComponent(medicationName)}`, payload);
    return await handleApiResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request was aborted');
    } else {
      console.error(error);
    }
    throw error;
  }
};

module.exports = {
  fetchMedicationInfo,
  fetchMedicationDetailsFromDB
};
