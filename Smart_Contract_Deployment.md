# Smart Contract Deployment
## Prerequisites
- Hyperledger Besu Private Network
- HealChain Smart Contract 
- Node.js v14 or higher

```bash
sudo apt-get install -y nodejs
```

## Deploying HealChain Smart Contract on Besu Private Network using Truffle
### Installing Truffle
- Use npm to install truffle.
```bash
npm install -g truffle
```
---
### Setting Up Truffle
- Create `HealChain-Contract` dir and initialise truffle.
```bash
mkdir HealChain-Contract
cd HealChain-Contract
truffle init
```
```bash
# Example Dir Structure
HealChain-Contract/
├── contracts
├── migrations
├── test
└── truffle-config.js
```

- Replace `truffle-config.js` content with the following code.
```js
const PrivateKeyProvider = require('@truffle/hdwallet-provider');
const privateKeys = [
	"0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
	"0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
	"0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f"
];

const privateKeyProvider = new PrivateKeyProvider(
	privateKeys,
	'http://<ip-address-besu-network>:8545',
	0,
	3
);

module.exports = {
	networks: {
		healchain: {
			provider: privateKeyProvider,
			network_id: "*"
		},
	},
	compilers:{
		solc:{
			version:"0.8.2",
		},
	},
};
```

- Create `1_initial_migration.js` file inside `migrations/` folder with the following code.
```js
const Migrations = artifacts.require( "Migrations");

module.exports = function (deployer) {
	deployer.deploy(Migrations);
};
```

- Create `2_deploy_contracts.js` file inside `migrations/` folder with the following code.
```js
const cf = artifacts.require("crowdfunding");
const cfl = artifacts.require("lib");

module.exports = function (deployer) {
    deployer.deploy(cfl).then(() => {
        deployer.link(cfl, cf); // Link the library to the contract
        return deployer.deploy(cf); // Deploy the contract
    });
};
```
- Create `Migrations.sol` file inside `contracts/` folder with the following code.
```sol
// SPDX-License- Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;
contract Migrations {
	address public owner;
	uint public last_completed_migration;

	constructor() {
		owner = msg.sender;
	}

	function setCompleted(uint completed) public restricted {
		last_completed_migration = completed;
	}
	modifier restricted() {
		if (msg. sender == owner)_;
	}
}
```

- Copy HealChain's Contracts from github `HealChain/contracts/` to `HealChain-Contract/contracts/` folder.
```bash
cp ../HealChain/contracts/* ./contracts/
```

```bash
# Example Dir Structure
HealChain-Contract/
├── contracts
│   ├── Migrations.sol
│   ├── crowdfunding.sol
│   └── crowdfunding_lib.sol
├── migrations
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── test
└── truffle-config.js
```

- To run `truffle-config.js`, `@truffle/hdwallet-provider` is imported, so we install it in `HealChain-Contract/` folder. 
```bash
sudo npm install @truffle/hdwallet-provider
```
---
### Build and Deploy

- Compile after all the above files have been modified
```bash
truffle compile
```

- Deploy the smart contracts to the healchain network
```bash
truffle migrate --network healchain
```

- Interactive JavaScript console that connects to your healchain network
```bash
truffle console --network healchain
```

Succesfully Deployed HealChain smart contracts on Besu Private network !!

## Retrieving ABI and Contract Address for UI Integration

- The ABI is stored in the file `./build/contracts/crowdfunding.json` after compiling the smart contract. This is required for interacting with the contract from a frontend application.

- The contract address is assigned when deploying the smart contract using `truffle migrate --network healchain`. This address is essential for linking the frontend with the deployed contract on the blockchain.
