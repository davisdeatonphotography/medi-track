/**
 * Fetch Medication Information.
 * @param {string} medicationName - A valid Medication Name.
 */
async function fetchMedicationInfo(medicationName) {
  if (!medicationName.trim()) {
    throw new Error('Invalid Parameters');
  }

  try {
    const response = await fetch(`/api/medications/${medicationName}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch medication information: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching information");
  }
}

export { fetchMedicationInfo };
