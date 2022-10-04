// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract PointsCounter {
    address private immutable _admin; 
    mapping(address => uint256) private _pointsPerUser;

    event PointsIncremented(address indexed user, uint256 points, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == _admin, "Sender isn't admin");
        _;
    }

    constructor() {
        _admin = msg.sender;
    }

    function incrementPoints(address user) onlyOwner external {
        _pointsPerUser[user]++;
        emit PointsIncremented(user, _pointsPerUser[user], block.timestamp);
    }
}
