// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadFileDropdown();
    loadUserDropdown();
    updateSharedUsers();
});

// Get file ID from URL parameter
function getFileIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load files into dropdown
function loadFileDropdown() {
    const fileList = JSON.parse(localStorage.getItem("fileList")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const dropdown = document.getElementById("fileDropdown");
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">-- Select a file --</option>';
    
    // Add user's files to dropdown
    fileList.forEach(file => {
        if (loggedInUser && file.uploadedById === loggedInUser.id) {
            const option = document.createElement('option');
            option.value = file.id;
            option.textContent = `${file.label} (${file.filename})`;
            dropdown.appendChild(option);
        }
    });
    
    // Pre-select file if ID is in URL
    const fileId = getFileIdFromURL();
    if (fileId) {
        dropdown.value = fileId;
        updateSharedUsers();
    }
    
    // Add event listener for dropdown change
    dropdown.addEventListener('change', updateSharedUsers);
}

// Load users into dropdown
function loadUserDropdown() {
    const shareUserList = JSON.parse(localStorage.getItem("shareUserList")) || [];
    const dropdown = document.getElementById("userDropdown");
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">-- Select a user --</option>';
    
    // Add users to dropdown
    shareUserList.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.name} (${user.email})`;
        dropdown.appendChild(option);
    });
}

// Update shared users table
function updateSharedUsers() {
    const selectedFileId = document.getElementById("fileDropdown").value;
    const shareData = JSON.parse(localStorage.getItem("shareData")) || [];
    const tbody = document.getElementById("shared-users-body");
    
    // Clear existing rows
    tbody.innerHTML = "";
    
    if (!selectedFileId) {
        // Add empty row when no file is selected
        tbody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #888;">Select a file to view shared users</td></tr>';
        return;
    }
    
    // Find shares for selected file
    const fileShares = shareData.filter(share => share.fileId == selectedFileId);
    let hasSharedUsers = false;
    
    fileShares.forEach(share => {
        if (share.filesharedto && Array.isArray(share.filesharedto)) {
            share.filesharedto.forEach(user => {
                hasSharedUsers = true;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td class="action-center">
                        <a href="#" class="remove-link" onclick="removeShare('${selectedFileId}', '${user.id}'); return false;">Remove</a>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    });
    
    // Add empty row if no shared users found
    if (!hasSharedUsers) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #888;">No users have access to this file</td></tr>';
    }
}

// Add share functionality
function addShare() {
    const selectedFileId = document.getElementById("fileDropdown").value;
    const selectedUserId = document.getElementById("userDropdown").value;
    
    if (!selectedFileId) {
        alert("Please select a file to share.");
        return;
    }
    
    if (!selectedUserId) {
        alert("Please select a user to share with.");
        return;
    }
    
    let shareData = JSON.parse(localStorage.getItem("shareData")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const shareUserList = JSON.parse(localStorage.getItem("shareUserList")) || [];
    const fileList = JSON.parse(localStorage.getItem("fileList")) || [];
    
    const selectedUser = shareUserList.find(u => u.id == selectedUserId);
    const selectedFile = fileList.find(f => f.id == selectedFileId);
    
    if (!selectedFile) {
        alert("File not found.");
        return;
    }
    
    if (!selectedUser) {
        alert("User not found.");
        return;
    }
    
    // Check if share already exists for this file
    let existingShare = shareData.find(share => share.fileId == selectedFileId);
    
    if (existingShare) {
        // Check if user is already in the shared list
        if (!existingShare.filesharedto.some(user => user.id == selectedUserId)) {
            existingShare.filesharedto.push({
                id: selectedUser.id,
                name: selectedUser.name,
                email: selectedUser.email
            });
        } else {
            alert("File is already shared with this user.");
            return;
        }
    } else {
        // Create new share entry with complete file information
        const newShare = {
            id: Number(new Date()),
            fileId: selectedFileId,
            filedescription: selectedFile.label,
            filename: selectedFile.filename,
            filesharedby: {
                id: loggedInUser.id,
                name: loggedInUser.fullname,
                email: loggedInUser.email
            },
            filesharedto: [{
                id: selectedUser.id,
                name: selectedUser.name,
                email: selectedUser.email
            }],
            dateShared: new Date().toLocaleDateString()
        };
        shareData.push(newShare);
    }
    
    localStorage.setItem("shareData", JSON.stringify(shareData));
    updateSharedUsers();
    
    // Reset user dropdown
    document.getElementById("userDropdown").value = "";
    
    alert("File shared successfully!");
}

// Remove share functionality
function removeShare(fileId, userId) {
    if (confirm("Are you sure you want to remove this share?")) {
        let shareData = JSON.parse(localStorage.getItem("shareData")) || [];
        
        // Find the share record
        const shareIndex = shareData.findIndex(share => share.fileId == fileId);
        
        if (shareIndex !== -1) {
            // Remove user from filesharedto array
            shareData[shareIndex].filesharedto = shareData[shareIndex].filesharedto.filter(user => user.id != userId);
            
            // If no users left, remove the entire share record
            if (shareData[shareIndex].filesharedto.length === 0) {
                shareData.splice(shareIndex, 1);
            }
            
            localStorage.setItem("shareData", JSON.stringify(shareData));
            updateSharedUsers();
            alert("Share removed successfully!");
        }
    }
}

// Add User Modal functions
function openAddUserModal() {
    const modal = document.getElementById("addUserModal");
    modal.classList.remove("modal-hidden");
    modal.classList.add("modal-visible");
}

function closeAddUserModal() {
    const modal = document.getElementById("addUserModal");
    modal.classList.remove("modal-visible");
    modal.classList.add("modal-hidden");
    
    // Clear form
    document.getElementById("newUserName").value = "";
    document.getElementById("newUserEmail").value = "";
}

function saveNewUser() {
    const userName = document.getElementById("newUserName").value.trim();
    const userEmail = document.getElementById("newUserEmail").value.trim();
    
    if (!userName || !userEmail) {
        alert("Please fill in both name and email fields.");
        return;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        alert("Please enter a valid email address.");
        return;
    }
    
    let shareUserList = JSON.parse(localStorage.getItem("shareUserList")) || [];
    
    // Check if user already exists
    const existingUser = shareUserList.find(user => 
        user.email.toLowerCase() === userEmail.toLowerCase()
    );
    
    if (existingUser) {
        alert("A user with this email already exists.");
        return;
    }
    
    // Add new user
    const newUser = {
        id: Number(new Date()),
        name: userName,
        email: userEmail,
        dateAdded: new Date().toLocaleDateString()
    };
    
    shareUserList.push(newUser);
    localStorage.setItem("shareUserList", JSON.stringify(shareUserList));
    
    // Refresh user dropdown
    loadUserDropdown();
    closeAddUserModal();
    
    alert("User added successfully!");
}