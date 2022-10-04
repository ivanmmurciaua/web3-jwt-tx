// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract PointsCounter {
    address private immutable _relayer;

    struct ToS {
        bytes32 r;
        bytes32 s;
        uint8   v;
    }

    mapping(address => ToS) private _tosToken;
    mapping(address => uint256) private _pointsPerUser;

    event UserToSAdd(address indexed user);
    event PointsIncremented(address indexed user, uint256 points, uint256 timestamp);

    modifier onlyRelayer() {
        require(msg.sender == _relayer, "Sender isn't relayer");
        _;
    }

    constructor() {
        _relayer = msg.sender;
    }

    function ToSign(address user, bytes32 r, bytes32 s, uint8 v) onlyRelayer external {
        ToS storage tos = _tosToken[user];
        tos.r = r;
        tos.s = s;
        tos.v = v;

        emit UserToSAdd(user);
    }

    function incrementPoints(address user) onlyRelayer external {
        _pointsPerUser[user]++;
        emit PointsIncremented(user, _pointsPerUser[user], block.timestamp);
    }

    function getToStoken(address user) onlyRelayer external view returns(ToS memory) {
        return _tosToken[user];
    }

    function getPointsByUser(address user) external view returns(uint256) {
        return _pointsPerUser[user];
    }

    function getPoints() external view returns(uint256) {
        return _pointsPerUser[msg.sender];
    }
}
