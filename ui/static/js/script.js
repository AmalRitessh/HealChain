// Web3.js setup
let web3;
let contractInstance;
let contractAddress = 'YOUR_CONTRACT_ADDRESS';
let contractAbi = [/* Your contract ABI */];

// Initialize Web3
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('No Ethereum provider detected.');
    }
    contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
}

// ======================
// POPUP CONTROL FUNCTIONS
// ======================

// Campaign Form
function openCampaignForm() {
    document.getElementById('campaignFormPopup').style.display = 'block';
}

function closeCampaignForm() {
    document.getElementById('campaignFormPopup').style.display = 'none';
}

// User Forms
function openUserForm() {
    document.getElementById('userFormSection').style.display = 'block';
}

function closeUserForm() {
    document.getElementById('userFormSection').style.display = 'none';
}

function openUpdateUserForm() {
    document.getElementById('updateUserFormPopup').style.display = 'block';
}

function closeUpdateUserForm() {
    document.getElementById('updateUserFormPopup').style.display = 'none';
}

function openViewUserForm() {
    document.getElementById('viewUserFormPopup').style.display = 'block';
    // Auto-populate with mock data when opened
    fetchUserDetails();
}

function closeViewUserForm() {
    document.getElementById('viewUserFormPopup').style.display = 'none';
}

// ======================
// EVENT LISTENERS
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // Campaign form buttons
    document.getElementById('createCampaignButton')?.addEventListener('click', openCampaignForm);
    document.getElementById('cancelCampaignButton')?.addEventListener('click', closeCampaignForm);
    
    // User form buttons (NEW - these were missing)
    document.getElementById('openUpdateUserFormButton')?.addEventListener('click', openUpdateUserForm);
    document.getElementById('cancelUpdateUserButton')?.addEventListener('click', closeUpdateUserForm);
    document.getElementById('openViewUserFormButton')?.addEventListener('click', openViewUserForm);
    document.getElementById('cancelViewUserButton')?.addEventListener('click', closeViewUserForm);
    
    // Fetch user details button (NEW)
    document.getElementById('fetchUserDetailsButton')?.addEventListener('click', fetchUserDetails);
    
    // Initialize counter
    document.getElementById('activeCampaigns').textContent = 0;
    
    // Hide user form section by default (NEW)
    document.getElementById('userFormSection').style.display = 'none';
});

// ======================
// FORM SUBMISSIONS
// ======================

// Campaign Form Submission
document.getElementById('campaignForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const targetAmount = document.getElementById('targetAmount').value;
    const deadline = document.getElementById('deadline').value;
    const medicalProof = document.getElementById('medicalProof').value;
    const imageFile = document.getElementById('image').files[0];
    
    let imageUrl = null;
    if (imageFile) imageUrl = URL.createObjectURL(imageFile);
    
    displayCampaignDetails(title, description, targetAmount, deadline, medicalProof, imageUrl);
    updateActiveCampaignsCount();
    closeCampaignForm();
    e.target.reset();
});

// User Form Submission
document.getElementById('userForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userProof = document.getElementById('userProof').value;
    const userPan = document.getElementById('userPan').value;
    
    const successMessage = document.getElementById('userCreationMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        setTimeout(() => successMessage.style.display = 'none', 3000);
    }
    
    closeUserForm();
    e.target.reset();
});

// Update User Form Submission (NEW - enhanced)
document.getElementById('updateUserForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userContact = document.getElementById('userContact').value;
    const userEmail = document.getElementById('userEmailAddress').value;
    const userPreference = document.getElementById('userPreference').value;
    
    const successMessage = document.getElementById('updateUserSuccessMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
            closeUpdateUserForm();
        }, 3000);
    }
    
    e.target.reset();
});

// ======================
// HELPER FUNCTIONS
// ======================

function displayCampaignDetails(title, description, targetAmount, deadline, medicalProof, imageUrl) {
    const container = document.getElementById('campaignsContainer');
    if (!container) return;
    
    const campaignElement = document.createElement('div');
    campaignElement.classList.add('campaign-box');
    
    const imageHTML = imageUrl 
        ? `<img src="${imageUrl}" alt="${title}" class="campaign-image">` 
        : '';
    
    campaignElement.innerHTML = `
        ${imageHTML}
        <h3>${title}</h3>
        <p>${description}</p>
        <p>Target Amount: ${targetAmount} ETH</p>
        <p>Deadline: ${deadline}</p>
        <p>Medical Proof: ${medicalProof}</p>
        <a href="view_campaign.html" class="btn">View Campaign</a>
    `;
    
    container.appendChild(campaignElement);
}

function updateActiveCampaignsCount() {
    const counter = document.getElementById('activeCampaigns');
    if (counter) {
        const currentCount = parseInt(counter.innerText) || 0;
        counter.innerText = currentCount + 1;
    }
}

