// displaying the user's full name from logged in user datas

let email = "";
let userData = JSON.parse(localStorage.getItem("loggedInUser"));
if (userData && userData.email !== null) {
  email = userData.email;
  document.getElementById("sub-title").textContent = `Welcome! ${email}.`;
} else {
  console.log("No logged in user data found.");
}
