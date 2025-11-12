// Fetch users from localStorage
let deleteUserId; // global variable
let urlParams = new URLSearchParams(window.location.search);
let Id = urlParams.get("id");

//Delete User Functionality
//Arrow Function to set delete user id
let deleteUser = (id) => {
	deleteUserId = id;
	showModal();
};

// Show modal function
function showModal() {
	const modal = document.getElementById('deleteModal');
	modal.classList.remove('modal-hidden');
	modal.classList.add('modal-visible');
}

// Close modal function
function closeModal() {
	const modal = document.getElementById('deleteModal');
	modal.classList.remove('modal-visible');
	modal.classList.add('modal-hidden');
}

function confirmDeletion() {
	console.log("Users :", user, "Deleting Id :", deleteUserId); // delete id

	let index = -1;
	index = user.findIndex((u) => u.id === deleteUserId);

	if (index !== -1 || index !== null) {
		user.splice(index, 1); // Remove user from array
		localStorage.setItem("userData", JSON.stringify(user));
		closeModal();
		location.reload();
		return;
	} else {
		console.log("User ID not found in user data.");
		alert("Invalid User ID.");
	}
}
//-----------------------------------------------------------------------------------------------------------------------

// Display users in table

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let user = localStorage.getItem("userData")
	? JSON.parse(localStorage.getItem("userData"))
	: [];

user.forEach((user) => {
	//-------------------Check the buttons first ----------------------------
	// Check if current user matches logged-in user
	let isCurrentUser = loggedInUser && loggedInUser.id === user.id;

	// Create disabled buttons if it's the current user
	let editButton = isCurrentUser
		? '<button class="edit_button" disabled style="cursor: not-allowed; color: #666; text-decoration: none;">Edit</button>'
		: '<button class="edit_button" onclick=\'window.location.href="EditUser.html?id=' +
		  user.id +
		  "\"'>Edit</button>";

	let deleteButton = isCurrentUser
		? '<button class="delete_button" disabled style="cursor: not-allowed; color: #666; text-decoration: none;">Delete</button>'
		: '<button class="delete_button" onclick="deleteUser(' +
		  user.id +
		  ')">Delete</button>';

	// Append user row to table
	document.getElementById(
		"user-table-body",
	).innerHTML += `<tr><td>${user.fullname}</td><td class='email-center'>${user.email}</td><td class='action-center'>${editButton} | ${deleteButton}</td></tr>`;
});

//-------------------------------------------------------------------------------------------------------
