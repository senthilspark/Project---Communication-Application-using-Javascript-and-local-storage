function Register() {
  let fullname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirm-password").value;

  if (fullname == null || fullname === "") {
    alert("Full name is required.");
    return false;
  }
  if (email == null || email === "") {
    alert("Email is required.");
    return false;
  }
  if (password == null || password === "") {
    alert("Password is required.");
    return false;
  }
  if (confirmPassword == null || confirmPassword === "") {
    alert("Please confirm your password.");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return false;
  }

  let localStorageUserData = {
    id: Number(Date.now()),
    fullname: fullname,
    email: email,
    password: password,
  };

  let users = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : []; // ternary operator

  // Check for existing email or fullname
  let index = -1;
  index = users.findIndex((user) => user.email === email);
  if (index !== -1) {
    alert("Email is already registered. Please use a different email.");
    return false;
  }
  index = users.findIndex((user) => user.fullname === fullname);
  if (index !== -1) {
    alert("Fullname is already registered. Please use a different fullname.");
    return false;
  }

  users.push(localStorageUserData);
  localStorage.setItem("userData", JSON.stringify(users));
  // Redirect with user ID as query parameter
  window.location.href = `./RegisterSuccess.html?id=${localStorageUserData.id}`;
  return false;
}
