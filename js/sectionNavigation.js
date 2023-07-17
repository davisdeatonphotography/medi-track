import { switchToSection } from "./domUtils.js";
import { fetchMedicationInfo, fetchMedicationDetailsFromDB } from './medicationInfoFetcher.js';


document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("main > section")),
    defaultSection = document.getElementById("default-section"),
    loginSection = document.getElementById("login-section"),
    signupSection = document.getElementById("signup-section"),
    apiKeySection = document.getElementById("api-key-section"),
    medicationSection = document.getElementById("medication-section"),
    medicationInfoSection = document.getElementById("medication-info-section"),
    loginForm = document.getElementById("login-form"),
    signupForm = document.getElementById("signup-form"),
    apiKeyForm = document.getElementById("api-key-form"),
    medicationForm = document.getElementById("medication-form"),
    medicationNameInput = document.getElementById("medication-name"),
    medicationList = document.getElementById("medication-list"),
    medicationInfoContainer = document.getElementById("medication-info-container"),
    medicationInfoTabs = document.getElementById("medication-info-tabs"),
    medicationInfoPanels = document.querySelectorAll(".info-panel"),
    tabDrugName = document.getElementById("tab-drugName"),
    tabDosageInstructions = document.getElementById("tab-dosageInstructions"),
    tabSideEffects = document.getElementById("tab-sideEffects"),
    tabDrugInteractions = document.getElementById("tab-drugInteractions"),
    tabPrecautions = document.getElementById("tab-precautions");

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
  }

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

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;

    try {
      // Perform authentication
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
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = signupForm.elements.username.value;
    const password = signupForm.elements.password.value;

    try {
      // Perform sign up
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
  });

  apiKeyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const apiKey = apiKeyForm.elements["api-key-input"].value;

    try {
      // Store the API key
      const response = await fetch("/api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        switchToSection(medication-section);
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
        alert("Failed to save API key. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  });

  medicationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const medicationName = medicationNameInput.value;

    try {
      // Perform medication form validation
      if (medicationName.trim() === "") {
        alert("Please enter a medication name.");
        return;
      }

      // Save the medication to the database
      await fetchMedicationDetailsFromDB(medicationName);

      switchToSection(medicationInfoSection);
      displayMedicationInfo(medicationName);
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  });

  async function addMedicationToDatabase() {
    // Simulated function for saving medication to the database
    const medicationListItem = document.createElement("div");
    medicationList.appendChild(medicationListItem);
    medicationListItem.innerHTML = medicationNameInput.value;
    medicationListItem.classList.add("medication-list-item");
  }

  async function displayMedicationInfo(medicationName) {
    try {
      const medicationInfo = await fetchMedicationInfo(medicationName);

      // Display the medication information in the UI
      // This assumes that you have an appropriate method to update the UI
      displayMedicationInfoPanel('panel-drugName', medicationInfo.drugName);
      displayMedicationInfoPanel('panel-dosageInstructions', medicationInfo.dosageInstructions);
      displayMedicationInfoPanel('panel-sideEffects', medicationInfo.sideEffects);
      displayMedicationInfoPanel('panel-drugInteractions', medicationInfo.drugInteractions);
      displayMedicationInfoPanel('panel-precautions', medicationInfo.precautions);

      // Show the tabs and info content
      showMedicationInfoTabs();
      showMedicationInfoContent();

    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching the medication information. Please try again.');
    }
  }

  async function fetchMedicationInfo(medicationName) {
    try {
      const response = await fetch(`/api/medications/${medicationName}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Failed to fetch medication information");
      }
    } catch (error) {
      console.error(error);
      throw new Error("An error occurred while fetching information");
    }
  }

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
  function showMedicationInfoTabs() {
    medicationInfoTabs.style.display = "flex";
  }

  function hideMedicationInfoTabs() {
    medicationInfoTabs.style.display = "none";
  }

  function showMedicationInfoContent() {
    medicationInfoContainer.style.display = "block";
  }

  function hideMedicationInfoContent() {
    medicationInfoContainer.style.display = "none";
  }

  function displayMedicationInfoPanel(panelId, content) {
    const panel = document.getElementById(panelId);
    panel.innerHTML = content;
  }

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
});
