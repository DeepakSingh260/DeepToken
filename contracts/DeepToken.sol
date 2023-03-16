// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract DeepToken{
    
    uint256 public totalSupply;
    string public name = "Deep Token";
    string public symbol = "Deep";
    string public standard = "Deep Token v1.0";

    event Transfer(address indexed _from , address indexed _to , uint256 _value);

    event Approve(address indexed _owner , address indexed _spender , uint256 _value);

    mapping(address => uint256) public balance_of;
    constructor(uint256 _initialSupply){
        balance_of[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to , uint256 _value ) public returns (bool sucess){
        require(balance_of[msg.sender]>= _value);

        balance_of[msg.sender] -= _value;
        balance_of[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true ;
    }

    function approve(address _spender , uint256 _value)public returns (bool sucess){

        emit Approve(msg.sender, _spender, _value);
        return true;
    }
    
}