const sections = Array.from(document.querySelectorAll("main > section"));
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

function hideSection(section) {
  section.style.opacity = "0";
  setTimeout(() => {
    section.style.display = "none";
  }, 500);
}

function displaySection(section) {
  setTimeout(() => {
    section.style.display = "block";
    setTimeout(() => {
      section.style.opacity = "1";
    }, 50);
  }, 500);
}

export function switchToSection(sectionId) {
  // Check if sections, loginForm, and signupForm exist
  if (!sections || !loginForm || !signupForm) {
    throw new Error("Sections or form elements not found in the DOM");
  }

  sections.forEach(hideSection);

  const section = document.getElementById(sectionId);
  
  // Check if section exists
  if (!section) {
    throw new Error(`Section with ID ${sectionId} not found in the DOM`);
  }
  
  displaySection(section);

  if ((loginForm.style.display === "block" || signupForm.style.display === "block") && sectionId !== "login-section" && sectionId !== "signup-section") {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
  }

  if (sectionId === "login-section") {
    loginForm.style.display = "block";
  } else if (sectionId === "signup-section") {
    signupForm.style.display = "block";
  } else if (sectionId === "api-key-section") {
    // If the API key section is being displayed, set an event listener to the API key form's submit event
    const apiKeyForm = document.getElementById("api-key-form");
    
    // Check if apiKeyForm exists
    if (!apiKeyForm) {
      throw new Error("API key form not found in the DOM");
    }
  document.addEventListener('DOMContentLoaded', () => {
    apiKeyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      switchToSection("health-data-upload-section");
    });
  });
  } else if (sectionId === "health-data-upload-section") {
    // If the health data upload section is being displayed, set an event listener to the health data upload form's submit event
    const healthDataUploadForm = document.getElementById("health-data-upload-form");
    
    // Check if healthDataUploadForm exists
    if (!healthDataUploadForm) {
      throw new Error("Health data upload form not found in the DOM");
    }

    healthDataUploadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      switchToSection("medication-section");
    });
  }
}

function deactivateTab(tab) {
  tab.classList.remove("active");
}

function hidePanel(panel) {
  panel.style.display = "none";
}

export function activateTab(tab) {
  const tabs = Array.from(document.querySelectorAll("#medication-info-tabs .tab"));
  const panels = Array.from(document.querySelectorAll(".info-panel"));

  // Check if tabs and panels exist
  if (!tabs || !panels) {
    throw new Error("Tabs or panels not found in the DOM");
  }

  tabs.forEach(deactivateTab);
  panels.forEach(hidePanel);

  const panel = document.getElementById(tab.getAttribute("data-panel"));

  // Check if panel exists
  if (!panel) {
    throw new Error("Panel not found in the DOM");
  }

  panel.style.display = "block";
  tab.classList.add("active");

  
}