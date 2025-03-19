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

// Handle user form submission
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const userProof = document.getElementById('userProof').value;
    const userPan = document.getElementById('userPan').value;

    console.log('User form submitted with data:');
    console.log(`User Proof: ${userProof}`);
    console.log(`User PAN: ${userPan}`);

    // Here you would typically interact with your smart contract to create a user
    // For example: contractInstance.methods.createUser(userProof, userPan).send({from: userAddress});

    // Display success message
    const successMessage = document.getElementById('userCreationMessage');
    successMessage.style.display = 'block';

    // Optionally, clear the form fields
    document.getElementById('userProof').value = '';
    document.getElementById('userPan').value = '';

    // Hide the success message after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
});

// Initialize Web3 and contract on page load
document.addEventListener('DOMContentLoaded', function() {
    initWeb3();
});