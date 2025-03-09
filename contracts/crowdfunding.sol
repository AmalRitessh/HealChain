// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./crowdfunding_lib.sol";

contract crowdfunding is lib{

    constructor()
    {
        contractOwner = msg.sender;
    }

    function createUser
        (
            string memory _userProof,
            string memory _userPan
        ) 
            public 
    {
        require(users[msg.sender].userId == address(0), "User already exists");
        userT.userId = msg.sender;
        userT.userProof = _userProof;
        userT.userPan = _userPan;
        userT.userRole = 0;
        userT.amountRecived = 0;
        userT.amountDonated = 0;
        noOfUsers++;
        users[msg.sender] = userT;
    } 

    function updateUser
        (
            string memory _userContact,
            string memory _userEmailAddress,
            string memory _userPreference
        )
            public 
    {
        require(users[msg.sender].userId == msg.sender, "User doesn't exist, create user");
        userT.userContact = _userContact;
        userT.userEmailAddress = _userEmailAddress;
        userT.userPreference = _userPreference;
        users[msg.sender] = userT;
    }
    
    function createCampaign
        (
            string memory _title, 
            string memory _description,
            uint256 _targetAmount, 
            uint256 _deadline, 
            string memory _medicalProof,
            string memory _image
        ) 
            public 
            payable 
            checkUserExist(msg.sender) 
            returns(uint256)
    {
        user storage userT = users[msg.sender];
        if(userT.userRole == 2 || userT.userRole == 3){ userT.userRole = 3; }
        else{ userT.userRole = 1; }

        camp.owner = msg.sender;
        camp.title = _title;
        camp.description = _description;
        camp.targetAmount = _targetAmount;
        camp.deadline = block.timestamp + _deadline;
        camp.amountCollected = 0;
        camp.medicalProof = _medicalProof;
        camp.image = _image;
        campaigns[noOfCampaings] = camp;
        noOfCampaings++;

        return noOfCampaings-1;
    } 

    function donateCampaign
        (
            uint256 campId
        ) 
            public 
            payable 
            isItTime(campId) 
            isTheAmountReached(campId) 
            owner(campId) 
            checkUserExist(msg.sender)
    {
        campaign storage camp = campaigns[campId];
        user storage userR = users[camp.owner];
        user storage userD = users[msg.sender];
        user storage userT = users[msg.sender];
        if(userT.userRole == 1 || userT.userRole == 3){ userT.userRole = 3; }
        else{ userT.userRole = 2; }

        payable(camp.owner).transfer(msg.value);
        userR.amountRecived = userR.amountRecived + msg.value;
        userD.amountDonated = userD.amountDonated + msg.value;
        camp.amountCollected = camp.amountCollected + msg.value;

        camp.listOfDonators.push(msg.sender);
        camp.listOfDonations.push(msg.value);
    }

    function getAllCampaign
        (

        )
            public
            view
            returns (uint256[] memory, string[] memory, string[] memory)
    {
        uint256[] memory campIds = new uint256[](noOfCampaings);
        string[] memory titles = new string[](noOfCampaings);
        string[] memory descriptions = new string[](noOfCampaings);
        string[] memory img = new string[](noOfCampaings);

        for(uint256 i = 0; i < noOfCampaings; i++){
            campIds[i] = i;
            campaign storage camp = campaigns[i];
            titles[i] = camp.title;
            descriptions[i] = camp.description;
            img[i] = camp.image;
        }

        return (campIds, titles, descriptions);
    }

    function viewCampaign
        (
            uint256 campId
        )
            public 
            view
            returns
                (
                    address,
                    string memory,
                    string memory,
                    uint256,
                    uint256,
                    uint256,
                    string memory,
                    string memory,
                    address[] memory,
                    uint256[] memory
                )
    {
        campaign storage camp = campaigns[campId];
        return
            (
                camp.owner,
                camp.title,
                camp.description,
                camp.targetAmount,
                camp.deadline,
                camp.amountCollected,
                camp.medicalProof,
                camp.image,
                camp.listOfDonators,
                camp.listOfDonations
            );
    }

    function viewUser
        (
            address userId
        )
            public
            view
            returns
                (
                    address,
                    string memory,
                    uint256,
                    uint256,
                    uint256,
                    string memory,
                    string memory,
                    string memory,
                    string memory
                )
    {
        user storage userT = users[userId];
        return 
            (
                userT.userId,
                userT.userProof,
                userT.userRole,
                userT.amountRecived,
                userT.amountDonated,
                userT.userContact,
                userT.userEmailAddress,
                userT.userPreference,
                userT.userPan
            );
    }    
}