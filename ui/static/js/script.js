// Web3.js setup
let web3;
let contractInstance;
let contractAddress = 'YOUR_CONTRACT_ADDRESS';
let contractABI = [/* your contract ABI */];

// Initialize web3
async function initWeb3() {
    const desiredNetwork = {
        chainId: '0x539', // Example: 1337 in hex (Ganache), change as needed
        chainName: 'healchain',
        rpcUrls: ['http://<ip-address>:8545'], // Your private node's URL
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        }
    };

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);

        try {
            const currentChainId = await web3.eth.getChainId();

            if (currentChainId !== parseInt(desiredNetwork.chainId, 16)) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: desiredNetwork.chainId }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        // Chain not added to MetaMask
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [desiredNetwork],
                            });
                        } catch (addError) {
                            console.error("Failed to add the network", addError);
                            return;
                        }
                    } else {
                        console.error("Failed to switch network", switchError);
                        return;
                    }
                }
            }

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();

            document.getElementById('connectButton').innerText = `Connected: ${accounts[0]}`;
            
            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            fetchAndDisplayCampaigns();
        } catch (error) {
            console.error("User denied account access or network switch failed", error);
        }

    } else {
        alert("MetaMask is not installed. Please install it to use this DApp.");
    }
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
function openUpdateUserForm() {
    document.getElementById('updateUserFormPopup').style.display = 'block';
}

function closeUpdateUserForm() {
    document.getElementById('updateUserFormPopup').style.display = 'none';
}

function openViewUserForm() {
    document.getElementById('viewUserFormPopup').style.display = 'block';
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
    document.getElementById('fetchUserDetailsButton')?.addEventListener('click', async () => {
        const userAddress = document.getElementById('userId').value;
        await displayUserDetails(userAddress);
    });
    
    // Initialize counter
    document.getElementById('activeCampaigns').textContent = 0;

    // Initialize totoal donations
    document.getElementById('totalDonations').textContent = 0;
    
    // Hide user form section by default (NEW)
    document.getElementById('userFormSection').style.display = 'none';
});

// ======================
// CAMPAIGN FORM SUBMISSIONS
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
            const img = imageUrl[i];

            displayCampaignDetails(id, title, description, img);
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

// ======================
// USER FORM SUBMISSIONS
// ======================

// User Form Submission
document.getElementById('userForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userProof = document.getElementById('userProof').value;
    const userPan = document.getElementById('userPan').value;

    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(contractABI, contractAddress); // Use your ABI and contract address

        try {
            await contract.methods.createUser(
                userProof,
                userPan
            ).send({ from: accounts[0] });

            console.log("User Created");
            alert("User Created");
            const successMessage = document.getElementById('userCreationMessage');
	    if (successMessage) {
		successMessage.style.display = 'block';
		setTimeout(() => successMessage.style.display = 'none', 3000);
	    }
        } catch (err) {
            console.error("Error creating user:", err);
            alert("Failed to create user.");
        }
    } else {
        alert("Please install MetaMask to use this feature.");
    }
     
    e.target.reset();
});

// Update User Form Submission (NEW - enhanced)
document.getElementById('updateUserForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userContact = document.getElementById('userContact').value;
    const userEmail = document.getElementById('userEmailAddress').value;
    const userPreference = document.getElementById('userPreference').value;
    
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(contractABI, contractAddress); // Use your ABI and contract address

        try {
            await contract.methods.updateUser(
                userContact,
                userEmail,
                userPreference
            ).send({ from: accounts[0] });

            console.log("User Updated");
            alert("User Updated");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user.");
        }
    } else {
        alert("Please install MetaMask to use this feature.");
    }

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

// Display User
async function displayUserDetails(userAddress) {

    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask to interact with the blockchain.");
        return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        const result = await contract.methods.viewUser(userAddress).call();

        document.getElementById("userAddress").textContent = result[0];
        document.getElementById("userContactDetails").textContent = result[5];
        document.getElementById("userEmailDetails").textContent = result[6];
        document.getElementById("userPreferenceDetails").textContent = result[7];
        document.getElementById("userRoleDetails").textContent = result[2];
        document.getElementById("userAmountRecivedDetails").textContent = result[3] + " wei";
        document.getElementById("userAmountDonatedDetails").textContent = result[4] + " wei";
        document.getElementById("userProofDetails").innerHTML = `<a href="${result[1]}" target="_blank">View</a>`;
        document.getElementById("userPanDetails").innerHTML = `<a href="${result[8]}" target="_blank">View</a>`;

    } catch (error) {
        console.error("Error fetching user details:", error);
        document.getElementById("userDetails").innerHTML = `<p style="color:red;">Failed to load user details.</p>`;
    }
}

// ======================
// VIEW CAMPAIGN
// ======================

document.addEventListener('DOMContentLoaded',() => {
	document.getElementById('searchButton').addEventListener('click', () => {
	    const searchCampaignId = document.getElementById('searchCampaignId').value;
	    if (searchCampaignId) {
		displayAllCampaignDetails(searchCampaignId);
	    } else {
		alert("Please enter a valid Campaign ID.");
	    }
	});
});

async function displayAllCampaignDetails(campaignId) {
    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask to interact with the blockchain.");
        return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
    try {
        const result = await contract.methods.viewCampaign(campaignId).call();

        const campaignInfoDiv = document.getElementById("campaignInfo");

        const imageHTML = image 
            ? `<img src="${result[7]}" alt="${result[1]}" class="campaign-image">` 
            : '';

        const medicalProofHTML = medicalProof 
            ? `<img src="${result[6]}" alt="${result[1]}" class="campaign-image">` 
            : '';

        // Clear previous data
        campaignInfoDiv.innerHTML = `
            <p><strong>Title:</strong> ${result[1]}</p>
            <p><strong>Description:</strong> ${result[2]}</p>
            ${medicalProofHTML}
            ${imageHTML}
            <p><strong>Owner:</strong> ${result[0]}</p>
            <p><strong>Target Amount:</strong> ${result[3]} wei</p>
            <p><strong>Deadline:</strong> ${result[4]}</p>
            <p><strong>Amount Collected:</strong> ${result[5]} wei</p>
        `;

        // Build Donators and Donations table
        if (result[8].length > 0) {
            let tableHTML = `
                <h3>Donators & Donations</h3>
                <table border="1" cellspacing="0" cellpadding="8">
                    <tr><th>Donator</th><th>Donation (wei)</th></tr>
            `;

            for (let i = 0; i < result[8].length; i++) {
                tableHTML += `<tr><td>${result[8][i]}</td><td>${result[9][i]}</td></tr>`;
            }

            tableHTML += `</table>`;
            campaignInfoDiv.innerHTML += tableHTML;
        } else {
            campaignInfoDiv.innerHTML += `<p><strong>No donations yet.</strong></p>`;
        }
    } catch (error) {
        console.error("Error fetching campaign details:", error);
        document.getElementById("campaignInfo").innerHTML = `<p style="color:red;">Failed to load campaign details.</p>`;
    }
}

// ======================
// DONATE CAMPAIGN
// ======================

// Add event listener to the donate button
document.addEventListener('DOMContentLoaded',() => {
	document.getElementById('donateButton').addEventListener('click', donateToCampaign);
});
// Function to handle donation
async function donateToCampaign() {
    const campaignId = document.getElementById('campaignId').value;
    const donationAmount = document.getElementById('donationAmount').value;

    if (!campaignId || !donationAmount) {
        alert("Please enter a valid Campaign ID and Donation Amount.");
        return;
    }

    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask to interact with the blockchain.");
        return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
        // Convert donation amount to wei
        const amountInWei = web3.utils.toWei(donationAmount, 'ether');

        // Call the donateCampaign function in the smart contract
        await contract.methods.donateCampaign(campaignId).send({
            from: accounts[0],
            value: amountInWei
        });

        alert("Donation successful! Thank you for your contribution.");
        window.location.href = "/"; // Redirect to home page after donation
    } catch (error) {
        console.error("Error donating to campaign:", error);
        alert("Failed to donate. Please check the console for details.");
    }
}

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
        <a href="view_campaign?cid=${id}" class="btn">View Campaign</a>
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
