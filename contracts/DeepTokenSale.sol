// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
import './DeepToken.sol';
contract DeepTokenSale{
    address admin;
    DeepToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;
    event Sell(address _buyer , uint256 _amount);
    constructor(DeepToken _tokenContract , uint256 _tokenPrice) {
        admin = msg.sender; 
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == _numberOfTokens*tokenPrice);
        tokenSold+=_numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }
}