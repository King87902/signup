document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const emailPhone = document.getElementById("email-phone").value.trim();
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const agreeTerms = document.querySelector(
      'input[name="agree-terms"]'
    ).checked;

    let isValid = true;

    // Validate First Name
    if (firstName === "") {
      showError("first-name", "First name is required.");
      isValid = false;
    }

    // Validate Last Name
    if (lastName === "") {
      showError("last-name", "Last name is required.");
      isValid = false;
    }

    // Validate Email or Phone Number
    if (emailPhone === "") {
      showError("email-phone", "Email or phone number is required.");
      isValid = false;
    } else if (!validateEmail(emailPhone) && !validatePhone(emailPhone)) {
      showError("email-phone", "Please enter a valid email or phone number.");
      isValid = false;
    }

    // Validate Date of Birth
    if (dob === "") {
      showError("dob", "Date of birth is required.");
      isValid = false;
    }

    // Validate Password
    if (password === "") {
      showError("password", "Password is required.");
      isValid = false;
    } else if (password.length < 8) {
      showError("password", "Password must be at least 8 characters long.");
      isValid = false;
    }

    // Validate Confirm Password
    if (confirmPassword === "") {
      showError("confirm-password", "Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      showError("confirm-password", "Passwords do not match.");
      isValid = false;
    }

    // Validate Terms Agreement
    if (!agreeTerms) {
      showError(
        "agree-terms",
        "You must agree to the Terms and Privacy policy."
      );
      isValid = false;
    }

    if (isValid) {
      alert("Account created successfully!");
      // Here you can add code to submit the form data to a server
    }
  });

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  const re = /^\d{10}$/; // Simple validation for 10-digit phone numbers
  return re.test(String(phone));
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  let errorElement;

  if (field) {
    // For input fields
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  } else {
    // For checkboxes (they don't have IDs, so we use their name attribute)
    const checkboxContainer = document.querySelector(
      `input[name="${fieldId}"]`
    ).parentNode;
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    checkboxContainer.appendChild(errorElement);
  }
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((error) => error.remove());
}

// Google Sign-In (unchanged)
function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);

  console.log("ID: " + responsePayload.sub);
  console.log("Full Name: " + responsePayload.name);
  console.log("Given Name: " + responsePayload.given_name);
  console.log("Family Name: " + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);

  alert("Google Sign-In successful! Welcome, " + responsePayload.name);
  // Here you can add code to handle the signed-in user, e.g., redirect or update UI
}

function decodeJwtResponse(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(
    document.getElementById("google-signin"),
    { theme: "outline", size: "large" } // Customization options
  );

  google.accounts.id.prompt(); // Also display the One Tap dialog
};
