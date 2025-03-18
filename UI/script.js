// Web3.js setup
let web3;
let contractInstance;
let contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
let contractAbi = [
    // Replace with your contract ABI
];

// Function to initialize Web3 and contract
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

// Function to open the popup form
function openForm() {
    document.getElementById('campaignFormPopup').style.display = 'block';
}

// Function to close the popup form
function closeForm() {
    document.getElementById('campaignFormPopup').style.display = 'none';
}

// Add event listeners to buttons
document.getElementById('createCampaignButton').addEventListener('click', openForm);
document.getElementById('cancelButton').addEventListener('click', closeForm);

// Handle form submission
document.getElementById('campaignForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const targetAmount = document.getElementById('targetAmount').value;
    const deadline = document.getElementById('deadline').value;
    const medicalProof = document.getElementById('medicalProof').value;

    console.log('Form submitted with data:');
    console.log(`Title: ${title}`);
    console.log(`Description: ${description}`);
    console.log(`Target Amount: ${targetAmount}`);
    console.log(`Deadline: ${deadline}`);
    console.log(`Medical Proof: ${medicalProof}`);

    // Display campaign details under Active Campaigns
    displayCampaignDetails(title, description, targetAmount, deadline, medicalProof);

    // Update the Active Campaigns count
    updateActiveCampaignsCount();

    closeForm(); // Close the form after submission
});

// Function to display campaign details under Active Campaigns
function displayCampaignDetails(title, description, targetAmount, deadline, medicalProof) {
    const campaignsContainer = document.getElementById('campaignsContainer');
    
    // Create a new campaign element
    const campaignElement = document.createElement('div');
    campaignElement.classList.add('campaign-box'); // Add the campaign-box class
    campaignElement.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <p>Target Amount: ${targetAmount}</p>
        <p>Deadline: ${deadline}</p>
        <p>Medical Proof: ${medicalProof}</p>
    `;
    
    // Add the campaign element to the container
    campaignsContainer.appendChild(campaignElement);
}



// Function to update the Active Campaigns count
function updateActiveCampaignsCount() {
    const currentCount = parseInt(document.getElementById('activeCampaigns').innerText);
    document.getElementById('activeCampaigns').innerText = currentCount + 1;
}

// Initialize Active Campaigns count on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('activeCampaigns').innerText = 0;
});

