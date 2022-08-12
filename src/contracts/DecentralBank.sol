pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

constructor(RWD _rwd,Tether _tether) public {
    rwd = _rwd;
    tether = _tether;
    owner = msg.sender;
}

// staking function
function depositTokens(uint256 _amount) public {
    // require staking amount to be greater than zero
    require(_amount > 0, 'amount cannot be 0');

    // 스테이킹할 tether tokens
    tether.transferFrom(msg.sender, address(this), _amount);

    // Update staking Balance
    stakingBalance[msg.sender] += _amount;

    if(!hasStaked[msg.sender]) {
        stakers.push(msg.sender);
    }

    // Update staking Balance
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
}

// unstake tokens
function unstakeTokens() public {
    uint balance = stakingBalance[msg.sender];
    require(balance > 0, 'staking balance cannot be less than zero');

    // 은행 주소에서 고객 주소로 언스테이킹
    tether.transfer(msg.sender, balance);

    // reset staking balance
    stakingBalance[msg.sender] = 0;

    // Update staking status
    isStaking[msg.sender] = false;
}

// issue rewards
function issueTokens() public {
    // require the owner to issue tokens only
    //require(msg.sender == owner, 'caller must be owner');

    for(uint i=0; i<stakers.length; i++) {
        address recipient = stakers[i];
        uint balance = stakingBalance[recipient] / 10; // devide 10 to create percentage incentive
        
        if(balance > 0){
            rwd.transfer(recipient, balance);
        }
    }
}
}
