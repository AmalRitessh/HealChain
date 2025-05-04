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

    // Initialize totoal donations
    document.getElementById('totalDonations').textContent = 0;
    
    // Hide user form section by default (NEW)
    document.getElementById('userFormSection').style.display = 'none';
});

// ======================
// FORM SUBMISSIONS
// ======================

// Fetching and Displaying all Campaigns
window.addEventListener('load', async () => {
    await fetchAndDisplayCampaigns();
});

async function fetchAndDisplayCampaigns() {
    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask to interact with the blockchain.");
        return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        const result = await contract.methods.getAllCampaign().call();

        const campaignIds = result[0];
        const titles = result[1];
        const descriptions = result[2];
        const imageUrl = result[3];
        const amount = result[4];

        const totalAmount = amount.reduce((acc, val) => acc + Number(val), 0);
        updateTotalDonationsCount(totalAmount);
        updateActiveCampaignsCount(campaignIds.length);

        for (let i = 0; i < campaignIds.length; i++) {
            const id = campaignIds[i];
            const title = titles[i];
            const description = descriptions[i];

            displayCampaignDetails(id, title, description, imageUrl);
        }
    } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        alert("Error fetching campaign list.");
    }
}


// Campaign Form Submission
document.getElementById('campaignForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const targetAmount = document.getElementById('targetAmount').value;
    const deadline = document.getElementById('deadline').value;
    const medicalProof = document.getElementById('medicalProof').value;
    const imageUrl = document.getElementById('image').value;
    
    // displayCampaignDetails(title, description, targetAmount, deadline, medicalProof, imageUrl);
    closeCampaignForm();
    e.target.reset();

    // Ensure Web3 is injected (e.g., by MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(contractABI, contractAddress); // Use your ABI and contract address

        try {
            const campaignId = await contract.methods.createCampaign(
                title,
                description,
                web3.utils.toWei(targetAmount, 'ether'), // assuming targetAmount is in ETH
                deadline,
                medicalProof,
                imageUrl
            ).send({ from: accounts[0] });

            console.log("Campaign created:", campaignId);
            alert(`Campaign created successfully. ID: ${campaignId.events?.CampaignCreated?.returnValues?.campaignId || 'N/A'}`);
        } catch (err) {
            console.error("Error creating campaign:", err);
            alert("Failed to create campaign.");
        }
    } else {
        alert("Please install MetaMask to use this feature.");
    }

    fetchAndDisplayCampaigns();
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

function displayCampaignDetails(id, title, description, imageUrl) {
    const container = document.getElementById('campaignsContainer');
    if (!container) return;
    
    const campaignElement = document.createElement('div');
    campaignElement.classList.add('campaign-box');
    
    const imageHTML = imageUrl 
        ? `<img src="${imageUrl}" alt="${title}" class="campaign-image">` 
        : '';
    
    campaignElement.innerHTML = `
        ${imageHTML}
        <h2>Campaign ID: ${id}</h3>
        <h3>Title:\n${title}</h3>
        <p>Description:\n${description}</p>
        <a href="view_campaign.html" class="btn">View Campaign</a>
    `;
    
    container.appendChild(campaignElement);
}

function updateActiveCampaignsCount(count) {
    const counter = document.getElementById('activeCampaigns');
    if (counter) {
        counter.innerText = count;
    }
}

function updateTotalDonationsCount(totalAmount) {
    const counter = document.getElementById('totalDonations');
    if (counter) {
        counter.innerText = totalAmount;
    }
}