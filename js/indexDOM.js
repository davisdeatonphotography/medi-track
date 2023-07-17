import { switchToSection } from "./domUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  const defaultSection = document.getElementById("default-section"),
    loginSection = document.getElementById("login-section"),
    signupSection = document.getElementById("signup-section"),
    apiKeySection = document.getElementById("api-key-section"),
    loginForm = document.getElementById("login-form"),
    signupForm = document.getElementById("signup-form"),
    apiKeyForm = document.getElementById("api-key-form");

  switchToSection('default-section');

  document.getElementById('switch-to-login').addEventListener('click', () => {
    switchToSection('login-section');
  });

  document.getElementById('switch-to-signup').addEventListener('click', () => {
    switchToSection('signup-section');
  });

  document.getElementById('signup-link').addEventListener('click', () => {
    switchToSection('signup-section');
  });

  document.getElementById('login-link').addEventListener('click', () => {
    switchToSection('login-section');
  });

  document.getElementById('forgot-password-link').addEventListener('click', () => {
    alert("Password reset functionality coming soon!");
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;
  
    fetch('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Received response from server: ", data);
        if (data.user) {
          console.log("User object found, switching to default-section");
          window.location.href = './dashboard.html';  // replace switchToSection('default-section');
        } else if (data.message === 'no api key') {
          console.log("No API key message found, switching to api-key-section");
          switchToSection('api-key-section');
        } else {
          // If the server doesn't respond with a user or 'no api key', the login failed
          console.log("No user object or API key message found, login failed");
          alert(data.message || 'Login failed');
        }
    })
    
    
      .catch(error => {
        console.error('An unexpected error occurred:', error);
        alert('An error occurred');
      });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = signupForm.elements.username.value;
    const password = signupForm.elements.password.value;
  
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'User created') {
          // If the server responds with 'User created', sign-up was successful
          switchToSection('api-key-section');
        } else if (data.message === 'no api key') {
          // If the server responds with 'no api key', switch to API key section
          switchToSection('api-key-section');
        } else {
          // If the server doesn't respond with 'User created' or 'no api key', sign-up failed
          alert(data.message || 'Sign-up failed');
        }
      })
      .catch(error => {
        console.error('An unexpected error occurred:', error);
        alert('An error occurred');
      });
  });
  apiKeyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const apiKey = apiKeyForm.elements["api-key-input"].value;
  
    fetch('/store-api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.user) {
          // If the server responds with a user, storing the API key was successful
          // Save the API key in local storage
          localStorage.setItem('apiKey', apiKey);
          window.location.href = './dashboard.html';
        } else {
          // If the server doesn't respond with a user, storing the API key failed
          alert(data.message || 'Failed to store API key');
        }
      })
      .catch(error => {
        console.error('An unexpected error occurred:', error);
        alert('An error occurred');
      });
  })
})