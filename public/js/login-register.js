document.addEventListener('DOMContentLoaded', function() {
    // --- Password Toggle Functionality (Generalized) ---
    // Select all elements with the 'toggle-password' class
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    // Add a click event listener to each icon found
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Find the closest parent '.input-field' container
            const inputFieldContainer = this.closest('.input-field');
            if (!inputFieldContainer) {
                console.error("Could not find parent '.input-field' for toggle icon.");
                return; // Stop if the container isn't found
            }
            // Find the input element (password or text) within that container
            const passwordField = inputFieldContainer.querySelector('input[type="password"], input[type="text"]');
            if (!passwordField) {
                console.error("Could not find password input within '.input-field'.");
                return; // Stop if the input isn't found
            }
            // Toggle the input type between 'password' and 'text'
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

     // --- Form Submission Handling (Login Form) ---
     const loginForm = document.getElementById('login-form');
     if (loginForm) {
         loginForm.addEventListener('submit', function(event) {
             event.preventDefault(); // Prevent the default form submission
             // Get data from register form fields
             const emailInput = document.getElementById('email');
             const passwordInput = document.getElementById('password');
 
             if (emailInput && passwordInput) {
                 const email = emailInput.value;
                 const password = passwordInput.value;
                 // Log data to the console
                 console.log('Login Attempt:');
                 console.log('Email:', email);
                 // Notify user of successful login
                 alert('Login successful!');
                 // Direct to dashboard.html after successful login
                 window.location.href = "/app/dashboard.html"; 
             } else {
                 console.error("Email or password input not found in the login form!");
             }
         });
     }
 
     // --- Form Submission Handling (Register Form) ---
     const registerForm = document.getElementById('register-form');
     if (registerForm) {
         registerForm.addEventListener('submit', function(event) {
             event.preventDefault();
             // Get data from register form fields 
             const regUserlInput = document.getElementById('register-username');
             const regEmailInput = document.getElementById('register-email');
             const regPasswordInput = document.getElementById('register-password');
             const confirmPasswordInput = document.getElementById('confirm-password');
 
             if (regEmailInput && regPasswordInput && confirmPasswordInput && regUserlInput) {
                 const regUsername = regUserlInput.value;
                 const regEmail = regEmailInput.value;
                 const regPassword = regPasswordInput.value;
                 const confirmPassword = confirmPasswordInput.value;

 
                 if (regPassword !== confirmPassword) {
                    // Notify user of password mismatch and clear fields
                     alert('Passwords do not match!');
                     // Clear confirm password fields
                     confirmPasswordInput.value = '';
                     confirmPasswordInput.focus();
                     return; // Stop submission
                 } else {
                     // Passwords match, proceed with registration
                     // Log data to the console
                     console.log('Registration Attempt:');
                     console.log('Username:', regUsername);
                     console.log('Email:', regEmail);
                 }
                 // Notify user of successful registration
                 alert('Register success');
             } else {
                  console.error("One or more input fields not found in the register form!");
             }
         });
     }
  });