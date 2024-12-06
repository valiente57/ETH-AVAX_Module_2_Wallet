import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Bank.module.css";
import simple_token_abi from "./Contracts/bank_app_abi.json";
import Interactions from "./Interactions";

const BankApp = () => {
  // deploy simple token contract and paste deployed contract address here. This value is local ganache chain
  let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [transferHash, setTransferHash] = useState(null);
  const [checkAcc, setCheckAcc] = useState("false");
  const [accStatus, setAccStatus] = useState("");
  const [accbalance, setAccBalance] = useState("");

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid-use of the application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      simple_token_abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const createAccount = async () => {
    let txt = await contract.createAcc();
    console.log(txt);
    setAccStatus("Your Account is created");
  };

  const checkAccountExists = async () => {
    let txt = await contract.accountExists();
    if (txt === true) {
      setCheckAcc("true");
    }
  };

  const AccountBalance = async () => {
    let txt = await contract.accountBalance();
    let balanceNumber = txt.toNumber();
    console.log(balanceNumber);
    setAccBalance("" + balanceNumber);
  };

  const DepositBalance = async (e) => {
    e.preventDefault();
    let depositAmount = e.target.depositAmount.value;
    let txt = await contract.deposit({
      value: depositAmount,
    });
  };

  const transferHandler = async (e) => {
    e.preventDefault();
    let transferAmount = e.target.sendAmount.value;
    let recieverAddress = e.target.recieverAddress.value;
    let txt = await contract.transferEther(recieverAddress, transferAmount);
    setTransferHash("Transfer confirmation hash: " + txt.hash);
  };

  const WithdrawBalance = async (e) => {
    e.preventDefault();
    let withdrawAmount = e.target.withdrawAmount.value;
    let txt = await contract.withdraw(withdrawAmount);
    console.log(txt);
  };

  return (
    <div className="All">
      <h2 className={styles.heading}>Bank Dapp - Manage Accounts</h2>
      <button className={styles.connectButton} onClick={connectWalletHandler}>
        {connButtonText}
      </button>

      <div className={styles.walletCard}>
        <div>
          <h3 className={styles.walletAddress}>Address: {defaultAccount}</h3>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.balanceButton} onClick={AccountBalance}>
            Check Account Balance
          </button>
          <h3 className={styles.balanceLabel}>
            Balance in the Bank: {accbalance}
          </h3>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>

      <div className={styles.interactionsCard}>
        <div>
          <h4 className={styles.interactionsHeading}>Account Actions</h4>
          <button className={styles.actionButton} onClick={createAccount}>
            Create Account
          </button>
          <button className={styles.actionButton} onClick={checkAccountExists}>
            Check Account Exists
          </button>
          <h4 className={styles.accountStatus}>Account Status: {checkAcc}</h4>
        </div>

        <form onSubmit={transferHandler}>
          <h3 className={styles.transferHeading}>Transfer Money</h3>
          <div className={styles.formGroup}>
            <label htmlFor="recieverAddress" className={styles.formLabel}>
              Recipient Address:
            </label>
            <input
              type="text"
              id="recieverAddress"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="sendAmount" className={styles.formLabel}>
              Transfer Amount:
            </label>
            <input
              type="number"
              id="sendAmount"
              min="0"
              step="1"
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.actionButton}>
            Transfer
          </button>
          <div className={styles.transferHash}>{transferHash}</div>
        </form>

        <form onSubmit={DepositBalance}>
          <h3 className={styles.depositHeading}>Deposit Money</h3>
          <div className={styles.formGroup}>
            <label htmlFor="depositAmount" className={styles.formLabel}>
              Deposit Amount:
            </label>
            <input
              type="number"
              id="depositAmount"
              min="0"
              step="1"
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.actionButton}>
            Deposit
          </button>
        </form>

        <form onSubmit={WithdrawBalance}>
          <h3 className={styles.withdrawHeading}>Withdraw Money</h3>
          <div className={styles.formGroup}>
            <label htmlFor="withdrawAmount" className={styles.formLabel}>
              Withdraw Amount:
            </label>
            <input
              type="number"
              id="withdrawAmount"
              min="0"
              step="1"
              className={styles.formInput}
            />
          </div>
          <button type="submit" className={styles.actionButton}>
            Withdraw
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankApp;
