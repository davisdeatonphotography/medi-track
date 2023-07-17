// Import external libraries and modules
import axios from 'axios';

// Define constants for DOM elements
const sections = Array.from(document.querySelectorAll("main > section"));
const defaultSection = document.getElementById("default-section");
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const apiKeySection = document.getElementById("api-key-section");
const medicationSection = document.getElementById("medication-section");
const medicationInfoSection = document.getElementById("medication-info-section");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const apiKeyForm = document.getElementById("api-key-form");
const medicationForm = document.getElementById("medication-form");
const medicationNameInput = document.getElementById("medication-name");
const medicationList = document.getElementById("medication-list");
const medicationInfoContainer = document.getElementById("medication-info-container");
const medicationInfoTabs = document.getElementById("medication-info-tabs");
const medicationInfoPanels = document.querySelectorAll(".info-panel");
const tabDrugName = document.getElementById("tab-drugName");
const tabDosageInstructions = document.getElementById("tab-dosageInstructions");
const tabSideEffects = document.getElementById("tab-sideEffects");
const tabDrugInteractions = document.getElementById("tab-drugInteractions");
const tabPrecautions = document.getElementById("tab-precautions");

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", setupDashboard);

// Setup the dashboard
function setupDashboard() {
  switchToSection(defaultSection);

  document.getElementById("switch-to-login").addEventListener("click", () => {
    switchToSection(loginSection);
  });

  document.getElementById("switch-to-signup").addEventListener("click", () => {
    switchToSection(signupSection);
  });

  document.getElementById("signup-link").addEventListener("click", () => {
    switchToSection(signupSection);
  });

  document.getElementById("login-link").addEventListener("click", () => {
    switchToSection(loginSection);
  });

  document.getElementById("forgot-password-link").addEventListener("click", () => {
    alert("Password reset functionality coming soon!");
  });

  loginForm.addEventListener("submit", handleLoginFormSubmit);
  signupForm.addEventListener("submit", handleSignupFormSubmit);
  apiKeyForm.addEventListener("submit", handleApiKeyFormSubmit);
  medicationForm.addEventListener("submit", handleMedicationFormSubmit);

  tabDrugName.addEventListener("click", () => {
    activateTab(tabDrugName);
  });

  tabDosageInstructions.addEventListener("click", () => {
    activateTab(tabDosageInstructions);
  });

  tabSideEffects.addEventListener("click", () => {
    activateTab(tabSideEffects);
  });

  tabDrugInteractions.addEventListener("click", () => {
    activateTab(tabDrugInteractions);
  });

  tabPrecautions.addEventListener("click", () => {
    activateTab(tabPrecautions);
  });
}

// Handle form submission for the login form
async function handleLoginFormSubmit(event) {
  event.preventDefault();
  const username = loginForm.elements.username.value;
  const password = loginForm.elements.password.value;

  try {
    const response = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      switchToSection(apiKeySection);
    } else {
      const errorMessage = await response.text();
      console.error(errorMessage);
      alert("Authentication failed. Please try again.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}

// Handle form submission for the signup form
async function handleSignupFormSubmit(event) {
  event.preventDefault();
  const username = signupForm.elements.username.value;
  const password = signupForm.elements.password.value;

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      switchToSection(apiKeySection);
    } else {
      const errorMessage = await response.text();
      console.error(errorMessage);
      alert("Sign up failed. Please try again.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}

// Handle form submission for the API key form
async function handleApiKeyFormSubmit(event) {
  event.preventDefault();
  const apiKey = apiKeyForm.elements["api-key-input"].value;

  try {
    const response = await fetch("/api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });

    if (response.ok) {
      switchToSection(medicationSection);
    } else {
      const errorMessage = await response.text();
      console.error(errorMessage);
      alert("Failed to save API key. Please try again.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}

// Handle form submission for the medication form
async function handleMedicationFormSubmit(event) {
  event.preventDefault();
  const medicationName = medicationNameInput.value;

  try {
    if (medicationName.trim() === "") {
      alert("Please enter a medication name.");
      return;
    }

    await fetchMedicationDetailsFromDB(medicationName);

    switchToSection(medicationInfoSection);
    await displayMedicationInfo(medicationName);
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}

// Fetch medication details from the database
async function fetchMedicationDetailsFromDB(medicationName) {
  const payload = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(`/medications/${encodeURIComponent(medicationName)}`, payload);
    if (!response.ok) {
      console.error(`Error in API: ${response.status} - ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error body: ${errorBody}`);
      throw new Error('Error in API');
    }

    const medication = await response.json();

    return medication;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Fetch medication information from the API
async function fetchMedicationInfo(medicationName) {
  try {
    const response = await fetch(`/api/medications/${medicationName}`);
    if (response.ok) {
      const medicationInfo = await response.json();
      // Add this block of code:
      const healthDataFilePath = 'path-to-user-health-data'; // Replace this with the actual file path
      const responsePython = await axios.post('http://localhost:5000/analyze', {
        file_path: healthDataFilePath,
        medication_input: JSON.stringify(medicationInfo)
      });
      const dataObject = responsePython.data;
      // The dataObject now contains the result from the Python server
      // Use this data to update the health dashboard
      updateHealthDashboard(dataObject);
      return medicationInfo;
    } else {
      throw new Error("Failed to fetch medication information");
    }
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching information");
  }
}

// Display the medication information on the dashboard
async function displayMedicationInfo(medicationName) {
  try {
    const medicationInfo = await fetchMedicationInfo(medicationName);

    displayMedicationInfoPanel('panel-drugName', medicationInfo.drugName);
    displayMedicationInfoPanel('panel-dosageInstructions', medicationInfo.dosageInstructions);
    displayMedicationInfoPanel('panel-sideEffects', medicationInfo.sideEffects);
    displayMedicationInfoPanel('panel-drugInteractions', medicationInfo.drugInteractions);
    displayMedicationInfoPanel('panel-precautions', medicationInfo.precautions);

    showMedicationInfoTabs();
    showMedicationInfoContent();

  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching the medication information. Please try again.');
  }
}

// Helper function to switch to a specific section
function switchToSection(section) {
  sections.forEach((section) => {
    section.style.opacity = "0";
    setTimeout(() => {
      section.style.display = "none";
    }, 500);
  });
  setTimeout(() => {
    section.style.display = "block";
    setTimeout(() => {
      section.style.opacity = "1";
    }, 50);
  }, 500);

  if ((loginForm.style.display === "block" || signupForm.style.display === "block") && section.id !== "login-section" && section.id !== "signup-section") {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
  }

  if (section.id === "login-section") {
    loginForm.style.display = "block";
  } else if (section.id === "signup-section") {
    signupForm.style.display = "block";
  }
}

// Helper function to activate a tab
function activateTab(tabButton) {
  const activeTab = document.querySelector(".info-tab.active");
  const activePanel = document.querySelector(".info-panel.active");
  if (activeTab) {
    activeTab.classList.remove("active");
  }
  if (activePanel) {
    activePanel.classList.remove("active");
  }
  tabButton.classList.add("active");
  const panelId = tabButton.getAttribute("id").replace("tab-", "panel-");
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add("active");
  }
}

// Helper function to show the medication info tabs
function showMedicationInfoTabs() {
  medicationInfoTabs.style.display = "flex";
}

// Helper function to hide the medication info tabs
function hideMedicationInfoTabs() {
  medicationInfoTabs.style.display = "none";
}

// Helper function to show the medication info content
function showMedicationInfoContent() {
  medicationInfoContainer.style.display = "block";
}

// Helper function to hide the medication info content
function hideMedicationInfoContent() {
  medicationInfoContainer.style.display = "none";
}

// Helper function to display content in a medication info panel
function displayMedicationInfoPanel(panelId, content) {
  const panel = document.getElementById(panelId);
  panel.innerHTML = content;
}