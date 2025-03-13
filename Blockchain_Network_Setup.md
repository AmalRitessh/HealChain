# Besu Network Setup
## Prerequisites
- Java 11+
```bash
sudo apt install openjdk-21-jdk
```
- Hyperledger Besu
```bash
wget https://github.com/hyperledger/besu/releases/download/25.2.2/besu-25.2.2.tar.gz
```
---
- Unzip Besu folder and Export the `bin` folder as an enviroment variable.
```bash
tar -xzf besu-25.2.2.tar.gz
cd besu-25.2.2
export PATH=$(pwd)/bin/:$PATH
```
- To make this persistent, add the line to your shell configuration file `~/.bashrc`
```bash
echo 'export PATH=$(pwd)/besu-25.2.2/bin/:$PATH' >> ~/.bashrc
```
- To verify besu installation 
```bash
besu --version
```

## Setting Up a Private Network Using IBFT 2.0
### Step 1: Set Up Node Directories
Each node in the private network needs a dedicated data directory to store blockchain data.

Create separate directories for the private network, along with individual directories for each of the four nodes, ensuring each node has its own data directory. (IBFT 2.0 requires a minimum of four nodes.)

```bash
mkdir -p IBFT-Network/Node-{1..4}/data
```

```bash
# Example Dir Structure
IBFT-Network/
├── Node-1
│   └── data
├── Node-2
│   └── data
├── Node-3
│   └── data
└── Node-4
    └── data
```

---

### Step 2: Generate the Genesis Configuration File

The genesis configuration file specifies the IBFT 2.0 parameters and determines the number of node key pairs to be generated.

Create a file named `ibftConfigFile.json`, add the following configuration details, and save it in the `IBFT-Network` directory.

```json
{
  "genesis": {
    "config": {
      "chainId": 1337,
      "berlinBlock": 0,
      "ibft2": {
        "blockperiodseconds": 2,
        "epochlength": 30000,
        "requesttimeoutseconds": 4
      }
    },
    "nonce": "0x0",
    "timestamp": "0x58ee40ba",
    "gasLimit": "0x47b760",
    "difficulty": "0x1",
    "mixHash": "0x63746963616c2062797a616e74696e65206661756c7420746f6c6572616e6365",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "alloc": {
      "fe3b557e8fb62b89f4916b721be55ceb828dbd73": {
        "privateKey": "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
        "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
        "balance": "0xad78ebc5ac6200000"
      },
      "627306090abaB3A6e1400e9345bC60c78a8BEf57": {
        "privateKey": "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
        "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
        "balance": "90000000000000000000000"
      },
      "f17f52151EbEF6C7334FAD080c5704D77216b732": {
        "privateKey": "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
        "comment": "private key and this comment are ignored. In a real chain, the private key should NOT be stored",
        "balance": "90000000000000000000000"
      }
    }
  },
  "blockchain": {
    "nodes": {
      "generate": true,
      "count": 4
    }
  }
}
```

```bash
# Example Dir Structure
IBFT-Network/
├── Node-1
│   └── data
├── Node-2
│   └── data
├── Node-3
│   └── data
├── Node-4
│   └── data
└── ibftConfigFile.json
```

---

### Step 3: Generate Node Keys and the Genesis File

Navigate to the `IBFT-Network` directory and use the `ibftConfigFile.json` configuration to generate the node keys and the genesis file.

```bash
besu operator generate-blockchain-config --config-file=ibftConfigFile.json --to=networkFiles --private-key-file-name=key
```

```bash
# Example Dir Structure
IBFT-Network/
├── Node-1
│   └── data
├── Node-2
│   └── data
├── Node-3
│   └── data
├── Node-4
│   └── data
├── ibftConfigFile.json
└── networkFiles
    ├── genesis.json
    └── keys
        ├── 0x0dd85ae97c27af4bf0f6d4fe89375e956ce4e7d9
        │   ├── key
        │   └── key.pub
        ├── 0x18e47fc914e75bfc1ad4b66f5a010732205811ec
        │   ├── key
        │   └── key.pub
        ├── 0x83a79240ad42b9b196a1a664e33852b4ad111548
        │   ├── key
        │   └── key.pub
        └── 0xb59cd35e09f9d06c26bc8c068353e6015e051167
            ├── key
            └── key.pub
```

---

### Step 4: Move the Genesis File to the IBFT-Network Directory

Move the genesis.json file to the IBFT-Network directory.

```bash
mv networkFiles/genesis.json IBFT-Network/
```

---

### Step 5: Move Node Private Keys to Respective Directories

For each node, transfer the key files into its designated data directory.

```bash
# Example Dir Structure
IBFT-Network/
├── Node-1
│   └── data
│        ├── key
│        └── key.pub
├── Node-2
│   └── data
│        ├── key
│        └── key.pub
├── Node-3
│   └── data
│        ├── key
│        └── key.pub
├── Node-4
│   └── data
│        ├── key
│        └── key.pub
├── genesis.json
├── ibftConfigFile.json
└── networkFiles
    └── keys
        ├── 0x0dd85ae97c27af4bf0f6d4fe89375e956ce4e7d9
        │   ├── key
        │   └── key.pub
        ├── 0x18e47fc914e75bfc1ad4b66f5a010732205811ec
        │   ├── key
        │   └── key.pub
        ├── 0x83a79240ad42b9b196a1a664e33852b4ad111548
        │   ├── key
        │   └── key.pub
        └── 0xb59cd35e09f9d06c26bc8c068353e6015e051167
            ├── key
            └── key.pub
```

---

### Step 6: Launch the First Node as the Bootnode

Navigate to the `Node-1` directory and start `Node-1`and also specify your machine's IP address.

```bash
besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-host=<ip-address> --min-gas-price=0
```

---

### Step 7: Launch Node-2, Node-3, and Node-4

Open a new terminal, navigate to each node's directory, and start the respective node, ensuring you specify the `enode` URL of Node-1 (the bootnode) obtained during its startup and also specify your machine's IP address.

Node 2
```bash
besu --data-path=data --genesis-file=../genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546 --rpc-http-host=<ip-address> --min-gas-price=0
```

Node 3
```bash
besu --data-path=data --genesis-file=../genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547 --rpc-http-host=<ip-address> --min-gas-price=0
```

Node 4
```bash
besu --data-path=data --genesis-file=../genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548 --rpc-http-host=<ip-address> --min-gas-price=0
```

---

### Step 8: Verify the Private Network Functionality

Open a new terminal and use `curl` to call the JSON-RPC API method `ibft_getValidatorsByBlockNumber` to confirm that the network recognizes all four validators.

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"ibft_getValidatorsByBlockNumber","params":["latest"], "id":1}' localhost:8545
```
