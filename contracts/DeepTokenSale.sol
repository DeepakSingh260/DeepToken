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
    function multiply(uint x , uint y) internal pure returns (uint z){
        require(y==0|| (z = x*y)/x==y);
    }
    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == multiply( _numberOfTokens,tokenPrice));
        require(tokenContract.balance_of(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));   
        tokenSold+=_numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale () public{
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balance_of(address(this))));
        address payable adminAddress = payable(address(uint160(admin)));
        selfdestruct(adminAddress);
    }
}