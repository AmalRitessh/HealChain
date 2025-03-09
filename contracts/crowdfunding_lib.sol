// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract lib{
    
    //--------------structures--------------
    struct user{
        address userId;
        string userProof;
        uint256 userRole;
        uint256 amountRecived;
        uint256 amountDonated;
        string userContact;
        string userEmailAddress;
        string userPreference;
        string userPan;
        
    }

    struct campaign{
        address owner;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 amountCollected;
        string medicalProof;
        string image;
        address[] listOfDonators;
        uint256[] listOfDonations;
    }
    
    //--------------state_variable--------------
    address public contractOwner;
    uint256 public noOfCampaings = 0;
    uint256 public noOfUsers = 0; 
    campaign camp;
    user userT;
    user userD;
    user userR;
    
    //--------------mapping--------------
    mapping(uint256 => campaign) public campaigns;
    mapping(address => user) public users;
    
    //--------------modifiers--------------
    modifier checkUserExist(address usr) {
        require(users[usr].userId == usr, "User doesn't exist, create user");
        _;
    }

    modifier isItTime(uint256 camp_id){
        campaign memory camp_t = campaigns[camp_id];
        require(block.timestamp < camp_t.deadline,"the campaign time's up.");
        _;
    }

    modifier isTheAmountReached(uint256 camp_id){
        campaign memory camp_t = campaigns[camp_id];
        require(camp_t.amountCollected < camp_t.targetAmount,"the campaign target amount reached.");
        _;
    }

    modifier owner(uint256 camp_id){
        campaign memory camp_t = campaigns[camp_id];
        require(camp_t.owner != msg.sender,"campaing owner cant pay to him self");
        _;
    }
}