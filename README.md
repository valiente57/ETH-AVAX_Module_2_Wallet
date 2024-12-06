# Dapp Wallet Interaction

This is a simple web based interaction to the wallet extension(Metamask) for performing transaction on blockchain network runninng on local computer(hardhat).

## Getting Started

### Prerequisites

* VScode
* Reminx, etc.
* Web3 wallet Extension(Metamask)

## Steps:
### For setting local network.
Clone the Repository and get the base files and code in desired directory.

Open the cloned directory on VScode, open a terminal and install dependencies with `npm i`.

Open a new terminal and start the Local Ethereum Network using Hardhat by `npx hardhat node`. The terminal will provide with few addresses, their private keys and RPC URL.

Open a new terminal and deploy the contract on the local network with `npx hardhat run --network localhost scripts/deploy.js`.

Open a new terminal and run the web application from the available scripts in the directory by `npm start`. The web application wil launch itself at http://localhost:3000.
### For Setting up wallet account.
Open the networks settings on the wallet and add the local network manually with approriate RPC URL and chain id.

Import an account manually by adding the private key of the address.

## Funtionality

Interact with the wallet through the UI, connect the wallet and perfom the transactions(Deposite, Withdraw, Transfer).
