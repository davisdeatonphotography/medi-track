import { switchToSection, activateTab } from "./domUtils.js";

function getInitials(name) {
  const parts = name.split(" ");
  const initials = parts.map(part => part[0].toUpperCase());
  return initials.join("");
}
document.addEventListener("DOMContentLoaded", () => {
  const medicationSection = document.getElementById("medication-section"),
    medicationInfoSection = document.getElementById("medication-info-section"),
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
    const nameInput = document.getElementById("name"),
    profileForm = document.getElementById("profile-form"),
    profileNameInput = document.getElementById("profile-name"),
    profileFeetInput = document.getElementById("profile-feet"),
    profileInchesInput = document.getElementById("profile-inches"),
    profileAgeInput = document.getElementById("profile-age"),
    profileGenderSelect = document.getElementById("profile-gender"),
    profileWeightInput = document.getElementById("profile-weight"),
    userIcon = document.getElementById("user-icon");

    userIcon.addEventListener("click", () => {
      switchToSection("profile-section");
    });
  

    fetch("/user")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const initials = getInitials(data.user.name);
      userIcon.textContent = initials;
    })
    .catch(error => {
      console.error(error);
      alert("An error occurred while fetching user information.");
    });
  

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = profileNameInput.value,
      feet = profileFeetInput.value,
      inches = profileInchesInput.value,
      age = profileAgeInput.value,
      gender = profileGenderSelect.value,
      weight = profileWeightInput.value;

    updateUserProfile(name, feet, inches, age, gender, weight);
  });

  function updateUserProfile(name, feet, inches, age, gender, weight) {
    const data = { name, feet, inches, age, gender, weight };
    fetch("/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert("Profile updated successfully!");
        } else {
          alert("An error occurred while updating profile.");
        }
      })
      .catch(error => {
        console.error(error);
        alert("An error occurred while updating profile.");
      });
  }
  tabDrugName.addEventListener("click", () => {
    window.tabManager.changeTab(tabDrugName);
  });

  tabDosageInstructions.addEventListener("click", () => {
    window.tabManager.changeTab(tabDosageInstructions);
  });

  tabSideEffects.addEventListener("click", () => {
    window.tabManager.changeTab(tabSideEffects);
  });

  tabDrugInteractions.addEventListener("click", () => {
    window.tabManager.changeTab(tabDrugInteractions);
  });

  tabPrecautions.addEventListener("click", () => {
    window.tabManager.changeTab(tabPrecautions);
  });

  medicationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const medicationName = medicationNameInput.value;
    // Perform medication form validation
    // ...
    addMedicationToDatabase(); // Should save the medication data to the database
    switchToSection('medication-info-section');
    displayMedicationInfo(medicationName);
  });

  function addMedicationToDatabase() {
    // Simulated function for saving medication to the database
    const medicationListItem = document.createElement("div");
    medicationList.appendChild(medicationListItem);
    medicationListItem.innerHTML = medicationNameInput.value;
    medicationListItem.classList.add("medication-list-item");
  }

  function displayMedicationInfo(medicationName) {
    // Simulated function for fetching medication info from API and displaying it
    fetchMedicationInfo(medicationName)
      .then((medicationInfo) => {
        if (medicationInfo) {
          activateTab(tabDrugName);
          displayMedicationInfoPanel("panel-drugName", medicationInfo.drugName);
          displayMedicationInfoPanel("panel-dosageInstructions", medicationInfo.dosageInstructions);
          displayMedicationInfoPanel("panel-sideEffects", medicationInfo.sideEffects);
          displayMedicationInfoPanel("panel-drugInteractions", medicationInfo.drugInteractions);
          displayMedicationInfoPanel("panel-precautions", medicationInfo.precautions);
        } else {
          activateTab(tabDrugName);
          displayMedicationInfoPanel("panel-drugName", "Information not found");
        }
      })
      .catch((error) => {
        console.error(error);
        activateTab(tabDrugName);
        displayMedicationInfoPanel("panel-drugName", "An error occurred while fetching information");
      });
  }

  function fetchMedicationInfo(medicationName) {
    return new Promise((resolve, reject) => {
      fetch('/fetch-medication-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ medicationName })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  function displayMedicationInfoPanel(panelId, content) {
    const panel = document.getElementById(panelId);
    panel.innerHTML = content;
  }
});
