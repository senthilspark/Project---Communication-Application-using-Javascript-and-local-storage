// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updatepage();
});

// Also call updatepage immediately for backwards compatibility
updatepage();

// Modal functions
function showUploadModal() {
	const modal = document.getElementById('addUploadModal');
	modal.classList.remove('modal-hidden');
	modal.classList.add('modal-visible');
}

function closeUploadModal() {
	const modal = document.getElementById('addUploadModal');
	modal.classList.remove('modal-visible');
	modal.classList.add('modal-hidden');
	// Clear form
	document.getElementById("File_description").value = "";
	document.getElementById("File_upload").value = "";
}

function uploadnow() {
	const description = document.getElementById("File_description").value;
	const fileInput = document.getElementById("File_upload");
	
	if (!description.trim()) {
		alert("Please enter a file description.");
		return;
	}
	
	if (!fileInput.files[0]) {
		alert("Please select a file.");
		return;
	}
	
	uploadfile();
	closeUploadModal();
}

function uploadfile() { 
	let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
	let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

	const newFile = {
		id: Number(new Date()), 
		label: document.getElementById("File_description").value,
		filename: document.getElementById("File_upload").files[0].name,
		uploadedBy: loggedInUser ? loggedInUser.fullname : "Unknown User",
		uploadedById: loggedInUser ? loggedInUser.id : null,
		dateUploaded: new Date().toLocaleDateString()
	};

	fileList.push(newFile);
	localStorage.setItem("fileList", JSON.stringify(fileList));
	updatepage();
}

function deleteFile(fileId) {
	if (confirm("Are you sure you want to delete this file?")) {
		let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
		fileList = fileList.filter(file => file.id !== fileId);
		localStorage.setItem("fileList", JSON.stringify(fileList));
		updatepage();
	}
}

function shareFile(fileId) {
	// Redirect to share document page
	window.location.href = "./sharedocument.html?id=" + fileId;
}

function openEditModal(fileId) {
	const fileList = JSON.parse(localStorage.getItem("fileList")) || [];
	const file = fileList.find(f => f.id == fileId);
	
	if (file) {
		// Populate the edit form with current data
		document.getElementById("Edit_description").value = file.label;
		
		// Store the file ID for use in saveEdit function
		document.getElementById("editModal").setAttribute("data-file-id", fileId);
		
		const modal = document.getElementById("editModal");
		modal.classList.remove("modal-hidden");
		modal.classList.add("modal-visible");
	}
}

function closeEditModal() {
	const modal = document.getElementById("editModal");
	modal.classList.remove("modal-visible");
	modal.classList.add("modal-hidden");
	
	// Clear form
	document.getElementById("Edit_description").value = "";
	document.getElementById("editModal").removeAttribute("data-file-id");
}

function saveEdit() {
	const fileId = document.getElementById("editModal").getAttribute("data-file-id");
	const newDescription = document.getElementById("Edit_description").value.trim();
	
	if (!newDescription) {
		alert("Please enter a file description.");
		return;
	}
	
	// Update the file list
	let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
	const fileIndex = fileList.findIndex(f => f.id == fileId);
	
	if (fileIndex !== -1) {
		fileList[fileIndex].label = newDescription;
		localStorage.setItem("fileList", JSON.stringify(fileList));
		
		// Refresh the page
		updatepage();
		closeEditModal();
		alert("File description updated successfully!");
	}
}


function updatepage() {
	let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
	let filedata = localStorage.getItem("fileList") ? JSON.parse(localStorage.getItem("fileList")) : [];

	// Clear existing content
	document.getElementById("user-table-body1").innerHTML = "";
	document.getElementById("user-table-body2").innerHTML = "";

	// Display user's own uploads
	let hasOwnFiles = false;
	filedata.forEach((file) => {
		let isOwnFile = loggedInUser && file.uploadedById === loggedInUser.id;
		
		if (isOwnFile) {
			hasOwnFiles = true;
			let editButton = '<button class="edit_button" onclick="openEditModal(' + file.id + ')">Edit</button>';
			let deleteButton = isOwnFile ? 
				'<button class="delete_button" onclick="deleteFile(' + file.id + ')">Delete</button>' :
				'<button class="delete_button" disabled style="color: #ccc;">Delete</button>';
			let shareButton = '<button class="edit_button" onclick="shareFile(' + file.id + ')">Share</button>';

			document.getElementById("user-table-body1").innerHTML +=
				`<tr><td>${file.label}</td><td class='filename-center'>${file.filename}</td><td class='action-center'>${editButton} | ${deleteButton} | ${shareButton}</td></tr>`;
		}
	});
	
	// Add empty row if no own files found
	if (!hasOwnFiles) {
		document.getElementById("user-table-body1").innerHTML = 
			'<tr><td colspan="3" style="text-align: center; color: #888;">No files uploaded yet</td></tr>';
	}

	// Display shared uploads
	const shareData = JSON.parse(localStorage.getItem("shareData")) || [];
	let hasSharedFiles = false;
	
	// Check if shareData exists and is not empty
	if (shareData && shareData.length > 0) {
		shareData.forEach((shared) => {
			// Display ALL shared files to ALL users
			hasSharedFiles = true;
			const sharedByName = shared.filesharedby ? shared.filesharedby.name : "Unknown User";
			document.getElementById("user-table-body2").innerHTML +=
				`<tr><td>${shared.filedescription}</td><td class='filename-center'>${shared.filename}</td><td class='action-center'>${sharedByName}</td></tr>`;
		});
	}
	
	// Add empty row if no shared files found
	if (!hasSharedFiles) {
		document.getElementById("user-table-body2").innerHTML = 
			'<tr><td colspan="3" style="text-align: center; color: #888;">No files have been shared yet</td></tr>';
	}
}