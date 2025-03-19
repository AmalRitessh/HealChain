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

// --- All event listeners and DOM-dependent code inside one DOMContentLoaded callback ---
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Web3
    initWeb3();

    // --- Update User Form Events ---
    const openUpdateUserFormButton = document.getElementById('openUpdateUserFormButton');
    if (openUpdateUserFormButton) {
        openUpdateUserFormButton.addEventListener('click', function () {
            document.getElementById('updateUserFormPopup').style.display = 'block';
        });
    }

    const cancelUpdateUserButton = document.getElementById('cancelUpdateUserButton');
    if (cancelUpdateUserButton) {
        cancelUpdateUserButton.addEventListener('click', function () {
            document.getElementById('updateUserFormPopup').style.display = 'none';
        });
    }

    // --- View User Form Events ---
    const openViewUserFormButton = document.getElementById('openViewUserFormButton');
    if (openViewUserFormButton) {
        openViewUserFormButton.addEventListener('click', function () {
            document.getElementById('viewUserFormPopup').style.display = 'block';
        });
    }

    const cancelViewUserButton = document.getElementById('cancelViewUserButton');
    if (cancelViewUserButton) {
        cancelViewUserButton.addEventListener('click', function () {
            document.getElementById('viewUserFormPopup').style.display = 'none';
        });
    }

    // --- Handle Create User Form Submission ---
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission behavior

            const userProof = document.getElementById('userProof').value;
            const userPan = document.getElementById('userPan').value;
            console.log('User form submitted with data:', userProof, userPan);

            // Here you would typically interact with your smart contract to create a user
            // contractInstance.methods.createUser(userProof, userPan).send({ from: userAddress });

            // Display success message and clear the form
            const successMessage = document.getElementById('userCreationMessage');
            successMessage.style.display = 'block';
            document.getElementById('userProof').value = '';
            document.getElementById('userPan').value = '';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        });
    }

    // --- Handle Update User Form Submission ---
    const updateUserForm = document.getElementById('updateUserForm');
    if (updateUserForm) {
        updateUserForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const userContact = document.getElementById('userContact').value;
            const userEmailAddress = document.getElementById('userEmailAddress').value;
            const userPreference = document.getElementById('userPreference').value;
            console.log('Update User form submitted with data:', userContact, userEmailAddress, userPreference);

            try {
                const accounts = await web3.eth.getAccounts();
                const userAddress = accounts[0];

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

                // Hide success message after 3 seconds and close form
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    document.getElementById('updateUserFormPopup').style.display = 'none';
                }, 3000);
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Failed to update user. Please check the console for details.');
            }
        });
    }

    // --- Fetch User Details ---
    const fetchUserDetailsButton = document.getElementById('fetchUserDetailsButton');
    if (fetchUserDetailsButton) {
        fetchUserDetailsButton.addEventListener('click', async function () {
            const userId = document.getElementById('userId').value;
            if (!userId) {
                alert('Please enter a valid user ID (address).');
                return;
            }

            try {
                const userDetails = await contractInstance.methods.viewUser(userId).call();
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
    }

    // --- Connect Wallet Button ---
    const connectWalletButton = document.getElementById("connectWalletButton");
    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", connectWallet);
    } else {
        console.error("connectWalletButton not found. Check your HTML.");
    }

    // --- Update Wallet Button if Already Connected ---
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
