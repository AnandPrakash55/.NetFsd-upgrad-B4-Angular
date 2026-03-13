

const ADMIN_EMAIL = "admin@upgrad.com";
const ADMIN_PASSWORD = "12345";
const EMS_LOGIN_FLAG = "ems_isAdminLoggedIn";

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!loginForm.checkValidity()) {
        loginForm.classList.add("was-validated");
        alert("Please fill all required fields correctly.");
        return;
      }

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem(EMS_LOGIN_FLAG, "true");
        window.location.href = "events.html";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }
});

