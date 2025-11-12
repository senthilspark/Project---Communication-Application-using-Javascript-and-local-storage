// Initialize page based on URL parameters
let urlParams = new URLSearchParams(window.location.search);
let fileId = urlParams.get("id");
let action = urlParams.get("action");
let currentFileId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (action === "share") {
        showShareSection();
    } else {
        showEditSection();
    }
});

function showEditSection() {
    document.getElementById("edit-section").classList.remove("section-hidden");
    document.getElementById("edit-section").classList.add("section-visible");
    document.getElementById("share-section").classList.remove("section-visible");
    document.getElementById("share-section").classList.add("section-hidden");
    
    if (fileId) {
        loadFileData();
    }
}

function showShareSection() {
    document.getElementById("share-section").classList.remove("section-hidden");
    document.getElementById("share-section").classList.add("section-visible");
    document.getElementById("edit-section").classList.remove("section-visible");
    document.getElementById("edit-section").classList.add("section-hidden");
    
    loadFilesDropdown();
    loadUsersDropdown();
}

function loadFileData() {
    let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
    let file = fileList.find(f => f.id == fileId);
    
    if (file) {
        document.getElementById("edit_description").value = file.label;
    }
}

function updateDocument() {
    let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
    let description = document.getElementById("edit_description").value;
    
    if (!description.trim()) {
        alert("Please enter a file description.");
        return false;
    }
    
    // Find and update the file
    for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].id == fileId) {
            fileList[i].label = description;
            break;
        }
    }
    
    localStorage.setItem("fileList", JSON.stringify(fileList));
    alert("Document updated successfully!");
    window.location.href = './9_Documentlist.html';
    return false;
}

function loadFilesDropdown() {
    let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
    let dropdown = document.getElementById("file-dropdown");
    
    dropdown.innerHTML = '<option value="">Select a file...</option>';
    
    fileList.forEach(file => {
        dropdown.innerHTML += `<option value="${file.id}">${file.label}</option>`;
    });
    
    if (fileId) {
        dropdown.value = fileId;
        currentFileId = parseInt(fileId);
        loadFileShares();
    }
}

function loadUsersDropdown() {
    let users = JSON.parse(localStorage.getItem("userData")) || [];
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let dropdown = document.getElementById("user-dropdown");
    
    dropdown.innerHTML = '<option value="">Select a user...</option>';
    
    users.forEach(user => {
        if (loggedInUser && user.id !== loggedInUser.id) {
            dropdown.innerHTML += `<option value="${user.id}">${user.fullname}</option>`;
        }
    });
}

function loadFileShares() {
    let selectedFileId = document.getElementById("file-dropdown").value;
    if (!selectedFileId) {
        document.getElementById("current-shares").classList.add("section-hidden");
        return;
    }
    
    currentFileId = parseInt(selectedFileId);
    document.getElementById("current-shares").classList.remove("section-hidden");
    document.getElementById("current-shares").classList.add("section-visible");
    
    let sharedData = JSON.parse(localStorage.getItem("sharedData")) || [];
    let users = JSON.parse(localStorage.getItem("userData")) || [];
    let sharesTableBody = document.getElementById("shares-table-body");
    
    sharesTableBody.innerHTML = "";
    
    // Find shares for this file
    let fileShares = sharedData.filter(share => share.fileId === currentFileId);
    
    fileShares.forEach(share => {
        share.sharedWith.forEach(userId => {
            let user = users.find(u => u.id === userId);
            if (user) {
                sharesTableBody.innerHTML += `
                    <tr>
                        <td>${user.fullname}</td>
                        <td class='action-center'>
                            <button class="remove_share_btn" onclick="removeShare(${share.id}, ${userId})">Remove</button>
                        </td>
                    </tr>
                `;
            }
        });
    });
}

function addShare() {
    let selectedUserId = parseInt(document.getElementById("user-dropdown").value);
    let selectedFileId = document.getElementById("file-dropdown").value;
    
    if (!selectedUserId) {
        alert("Please select a user to share with.");
        return;
    }
    
    if (!selectedFileId) {
        alert("Please select a file to share.");
        return;
    }
    
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let sharedData = JSON.parse(localStorage.getItem("sharedData")) || [];
    let fileList = JSON.parse(localStorage.getItem("fileList")) || [];
    
    // Find the file
    let file = fileList.find(f => f.id == selectedFileId);
    if (!file) {
        alert("File not found.");
        return;
    }
    
    // Check if already shared with this user
    let existingShare = sharedData.find(share => 
        share.fileId === parseInt(selectedFileId) && 
        share.sharedWith.includes(selectedUserId)
    );
    
    if (existingShare) {
        alert("File is already shared with this user.");
        return;
    }
    
    // Find existing share record for this file
    let shareRecord = sharedData.find(share => share.fileId === parseInt(selectedFileId));
    
    if (shareRecord) {
        // Add user to existing share
        shareRecord.sharedWith.push(selectedUserId);
    } else {
        // Create new share record
        let newShare = {
            id: Number(new Date()),
            fileId: parseInt(selectedFileId),
            sharedBy: loggedInUser ? loggedInUser.fullname : "Unknown User",
            sharedById: loggedInUser ? loggedInUser.id : null,
            sharedWith: [selectedUserId],
            dateShared: new Date().toLocaleDateString()
        };
        sharedData.push(newShare);
    }
    
    localStorage.setItem("sharedData", JSON.stringify(sharedData));
    
    // Reset user dropdown
    document.getElementById("user-dropdown").value = "";
    
    // Reload shares display
    loadFileShares();
    
    alert("File shared successfully!");
}

function removeShare(shareId, userId) {
    if (!confirm("Are you sure you want to remove this share?")) {
        return;
    }
    
    let sharedData = JSON.parse(localStorage.getItem("sharedData")) || [];
    
    // Find the share record
    let shareRecord = sharedData.find(share => share.id === shareId);
    
    if (shareRecord) {
        // Remove user from shared list
        shareRecord.sharedWith = shareRecord.sharedWith.filter(id => id !== userId);
        
        // If no users left, remove the entire share record
        if (shareRecord.sharedWith.length === 0) {
            sharedData = sharedData.filter(share => share.id !== shareId);
        }
    }
    
    localStorage.setItem("sharedData", JSON.stringify(sharedData));
    loadFileShares();
    alert("Share removed successfully!");
}