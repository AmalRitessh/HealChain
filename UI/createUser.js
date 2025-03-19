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

// Function to open the Update User popup form
function openUpdateUserForm() {
    document.getElementById('updateUserFormPopup').style.display = 'block';
}

// Function to close the Update User popup form
function closeUpdateUserForm() {
    document.getElementById('updateUserFormPopup').style.display = 'none';
}

// Function to open the View User popup form
function openViewUserForm() {
    document.getElementById('viewUserFormPopup').style.display = 'block';
}

// Function to close the View User popup form
function closeViewUserForm() {
    document.getElementById('viewUserFormPopup').style.display = 'none';
}

// Add event listeners to buttons
document.getElementById('openUpdateUserFormButton').addEventListener('click', openUpdateUserForm);
document.getElementById('cancelUpdateUserButton').addEventListener('click', closeUpdateUserForm);
document.getElementById('openViewUserFormButton').addEventListener('click', openViewUserForm);
document.getElementById('cancelViewUserButton').addEventListener('click', closeViewUserForm);

// Handle Create User form submission
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

// Handle Update User form submission
document.getElementById('updateUserForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const userContact = document.getElementById('userContact').value;
    const userEmailAddress = document.getElementById('userEmailAddress').value;
    const userPreference = document.getElementById('userPreference').value;

    console.log('Update User form submitted with data:');
    console.log(`User Contact: ${userContact}`);
    console.log(`User Email Address: ${userEmailAddress}`);
    console.log(`User Preference: ${userPreference}`);

    try {
        // Get the user's Ethereum address
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Call the smart contract's updateUser function
        await contractInstance.methods
            .updateUser(userContact, userEmailAddress, userPreference)
            .send({ from: userAddress });

        // Display success message
        const successMessage = document.getElementById('updateUserSuccessMessage');
        successMessage.style.display = 'block';

        // Clear the form fields
        document.getElementById('userContact').value = '';
        document.getElementById('userEmailAddress').value = '';
        document.getElementById('userPreference').value = '';

        // Hide the success message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            closeUpdateUserForm(); // Close the form after submission
        }, 3000);
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user. Please check the console for details.');
    }
});

// Handle Fetch User Details button click
document.getElementById('fetchUserDetailsButton').addEventListener('click', async function() {
    const userId = document.getElementById('userId').value;

    if (!userId) {
        alert('Please enter a valid user ID (address).');
        return;
    }

    try {
        // Call the smart contract's viewUser function
        const userDetails = await contractInstance.methods
            .viewUser(userId)
            .call();

        // Display user details
        document.getElementById('userAddress').innerText = userDetails[0];
        document.getElementById('userContactDetails').innerText = userDetails[1];
        document.getElementById('userEmailDetails').innerText = userDetails[2];
        document.getElementById('userPreferenceDetails').innerText = userDetails[3];
        document.getElementById('userProofDetails').innerText = userDetails[4];
        document.getElementById('userPanDetails').innerText = userDetails[5];
    } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details. Please check the console for details.');
    }
});

// Initialize Web3 and contract on page load
document.addEventListener('DOMContentLoaded', function() {
    initWeb3();
});
