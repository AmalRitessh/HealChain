// script.js

// Web3.js setup
let web3;
let contractInstance;
let contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
let contractAbi = [
    // Replace with your contract ABI
];

// Function to initialize Web3 and contract
async function initWeb3() {
    if (typeof window.ethereum !== "undefined") {
        try {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("MetaMask detected and connected.");
            contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
        } catch (error) {
            console.error("User denied account access:", error);
        }
    } else {
        console.error("No Ethereum provider detected. Retrying...");
        setTimeout(initWeb3, 1000); // Retry after 1 second
    }
}

// -- All event listeners and DOM-dependent code are placed inside one DOMContentLoaded callback --
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Web3
    initWeb3();

    // --- Set initial Active Campaigns count ---
    const activeCampaignsElement = document.getElementById('activeCampaigns');
    if (activeCampaignsElement) {
        activeCampaignsElement.innerText = 0;
    }

    // --- Event listeners for user popup form ---
    const createUserButton = document.getElementById('createUserButton');
    if (createUserButton) {
        createUserButton.addEventListener('click', function() {
            document.getElementById('userFormPopup').style.display = 'block';
        });
    }
    const cancelUserButton = document.getElementById('cancelUserButton');
    if (cancelUserButton) {
        cancelUserButton.addEventListener('click', function() {
            document.getElementById('userFormPopup').style.display = 'none';
        });
    }

    // --- Handle user form submission ---
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            const userProof = document.getElementById('userProof').value;
            const userPan = document.getElementById('userPan').value;
            console.log('User form submitted with data:', userProof, userPan);

            // Display success message and optionally clear the form
            const successMessage = document.getElementById('userCreationMessage');
            successMessage.style.display = 'block';
            document.getElementById('userProof').value = '';
            document.getElementById('userPan').value = '';
            setTimeout(() => {
                successMessage.style.display = 'none';
                // Close the form if needed
                document.getElementById('userFormPopup').style.display = 'none';
            }, 3000);
        });
    }

    // --- Event listeners for campaign popup form ---
    const createCampaignButton = document.getElementById('createCampaignButton');
    if (createCampaignButton) {
        createCampaignButton.addEventListener('click', function() {
            document.getElementById('campaignFormPopup').style.display = 'block';
        });
    }
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            document.getElementById('campaignFormPopup').style.display = 'none';
        });
    }

    // --- Handle campaign form submission ---
    const campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
        campaignForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const targetAmount = document.getElementById('targetAmount').value;
            const deadline = document.getElementById('deadline').value;
            const medicalProof = document.getElementById('medicalProof').value;
            console.log('Campaign form submitted:', title, description, targetAmount, deadline, medicalProof);
            
            // Display campaign details
            displayCampaignDetails(title, description, targetAmount, deadline, medicalProof);
            updateActiveCampaignsCount();
            document.getElementById('campaignFormPopup').style.display = 'none';
        });
    }

    // --- Function to display campaign details ---
    function displayCampaignDetails(title, description, targetAmount, deadline, medicalProof) {
        const campaignsContainer = document.getElementById('campaignsContainer');
        const campaignElement = document.createElement('div');
        campaignElement.classList.add('campaign-box');
        campaignElement.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <p>Target Amount: ${targetAmount}</p>
            <p>Deadline: ${deadline}</p>
            <p>Medical Proof: ${medicalProof}</p>
        `;
        campaignsContainer.appendChild(campaignElement);
    }

    // --- Function to update Active Campaigns count ---
    function updateActiveCampaignsCount() {
        const currentCount = parseInt(activeCampaignsElement.innerText);
        activeCampaignsElement.innerText = currentCount + 1;
    }

    // --- Connect Wallet button event listener (Step 1) ---
    const connectWalletButton = document.getElementById("connectWalletButton");
    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", connectWallet);
    } else {
        console.error("connectWalletButton not found. Check your HTML.");
    }

    // --- If already connected, update Connect Wallet button ---
    if (window.ethereum && window.ethereum.isConnected && window.ethereum.isConnected()) {
        window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
            if (accounts.length > 0 && connectWalletButton) {
                connectWalletButton.innerText = "Connected";
                connectWalletButton.style.backgroundColor = "#28a745";
            }
        });
    }
});

// Function to connect to MetaMask
async function connectWallet() {
    const button = document.getElementById('connectWalletButton');
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
            console.log('Connected wallet address:', userAddress);
            button.innerText = "Connected";
            button.style.backgroundColor = "#28a745";
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect wallet. Please check the console for details.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to connect your wallet.');
    }
}
