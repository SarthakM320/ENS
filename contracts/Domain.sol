// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { StringUtils } from "./libraries/StringUtils.sol";

contract ENS is Ownable{

    struct userDataExists{
        address user;   
        string imageHash;
    }
    mapping (string => userDataExists) public ensToAddress;
    mapping (address => string) public  addressToName;
    address public nullAddress = address(0);
    string tempImageHash;
    string tempName;

    modifier checkNameTaken(string memory name,bool wantIt){
        require((ensToAddress[name].user != nullAddress) == wantIt);
        _;
    }

    modifier checkENSMade(address owner, bool wantIt){
        require((StringUtils.strlen(addressToName[owner])>0) == wantIt);
        _;
    }

    modifier checkNameNull(string memory name){
        require(StringUtils.strlen(name)>0);
        _;
    }

    function addENS(string calldata name,string calldata imageHash) 
    checkNameTaken(name,false) checkNameNull(name) checkENSMade(msg.sender,false) external {
        ensToAddress[name].user = msg.sender;
        ensToAddress[name].imageHash = imageHash;
        addressToName[msg.sender] = name;    
    }
    
    function viewOwnerName(address owner) checkENSMade(owner,true) view external returns (string memory){
        return addressToName[owner];
    }

    function getImageHash(address owner) checkENSMade(owner,true) view external returns (string memory){
        return ensToAddress[addressToName[owner]].imageHash;
    }
    
    function getImageHash(string calldata name) checkNameNull(name) 
    checkNameTaken(name,true) view external returns (string memory){
        return ensToAddress[name].imageHash;
    }

    function changeName(string calldata name) checkNameNull(name) 
    checkNameTaken(name,false) checkENSMade(msg.sender,true) external {
        tempName = addressToName[msg.sender];
        tempImageHash = ensToAddress[tempName].imageHash;
        addressToName[msg.sender] = name; 
        ensToAddress[name].user = msg.sender;
        ensToAddress[name].imageHash = tempImageHash;
        delete ensToAddress[tempName];
    }

    function changeImageHash(string calldata imageHash) checkENSMade(msg.sender,true) external {
        ensToAddress[addressToName[msg.sender]].imageHash = imageHash;
    }
    
}