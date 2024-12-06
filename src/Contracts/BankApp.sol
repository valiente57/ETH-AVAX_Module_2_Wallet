// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract BankApp {
    mapping(address => uint256) UserAccount;
    mapping(address => bool) UserExists;

    function createAcc() public returns (bool) {
        require(!UserExists[msg.sender], "User already Exists");
        UserExists[msg.sender] = true;
        return true;
    }

    function accountExists() public view returns (bool) {
        return UserExists[msg.sender];
    }

    function deposit() public payable {
        UserAccount[msg.sender] += msg.value;
    }

    function withdraw(uint256 withdrawAmount) public {
        // Account should exist & Amount to be withdrawn should be less than or equal to account balance
        require(UserExists[msg.sender], "User does not exist");
        require(withdrawAmount <= UserAccount[msg.sender], "Insufficient balance");

        UserAccount[msg.sender] -= withdrawAmount;
        // Now get that amount withdrawn, Amount withdrawn must be transferred
        payable(msg.sender).transfer(withdrawAmount);
    }

    function accountBalance() public view returns (uint256) {
        return UserAccount[msg.sender];
    }

    function transferEther(address payable receiver, uint256 transferAmount) public {
        require(UserExists[receiver], "Receiver does not exist");
        require(UserExists[msg.sender], "Sender does not exist");
        require(transferAmount > 0, "Transfer amount must be greater than zero");
        require(transferAmount <= UserAccount[msg.sender], "Insufficient balance");

        UserAccount[msg.sender] -= transferAmount;
        UserAccount[receiver] += transferAmount;
        // Amount withdrawn must be transferred
        receiver.transfer(transferAmount);
    }
}
