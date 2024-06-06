// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "./console.sol";
struct Pool {
    uint256 id;
    uint256 totalUsers;
    uint256 totalPool;
    int256 status; // 0 => defecto , 1= iniciado,  2 = termino
}
struct UserReward {
    uint256 poolId; // solo para cuando tengamos que traer informacion en masivo.
    uint256 depositTotal;
    uint256 reward;
    uint256 userRewardId;
    address user;
}

//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 contract owner wallet 1:
//0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2                wallet 2
contract STLHarvest is Ownable, AccessControl {
    bytes32 public constant USE_ROLE = keccak256("USE_ROLE");
    address _owner;
    uint256 private _poolsCounter;
    mapping(uint256 => Pool) public _pools;
    mapping(uint256 => mapping(uint256 => UserReward)) public _usersRewardsPool;
    ERC20 _token;

    event poolStarted(uint256 poolId, Pool pool);
    event poolDeposit(
        uint256 poolId,
        uint256 amount,
        Pool pool,
        UserReward user
    );
    event poolRewards(uint256 poolId, Pool pool, uint256 totalReward);

    constructor(address tokenToUse) Ownable(msg.sender) {
        _owner = payable(msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRoleUse(msg.sender);
        _token = ERC20(tokenToUse);
    }

    function createPool() public onlyRole(USE_ROLE) returns (Pool memory) {
        _pools[_poolsCounter] = Pool(_poolsCounter, 0, 0, 1);
        emit poolStarted(_poolsCounter, _pools[_poolsCounter]);
        _poolsCounter += 1;
        return _pools[_poolsCounter];
    }

    function deposit(
        uint256 poolId,
        uint256 amount
    )
        public
        HasAllowance(msg.sender, amount)
        HasBalance(msg.sender, amount)
        CanUsePool(poolId)
    {
        _token.transferFrom(msg.sender, address(this), amount);
        UserReward memory user = findUserInPool(msg.sender, poolId);
        _pools[poolId].totalPool += amount;
        bool exist = true;
        if (user.user == address(this)) {
            exist = false;
        }
        if (exist == false) {
            // si no es igual ,es porque no existe por ende es un nuevo usuario.
            user.poolId = poolId;
            user.user = msg.sender;
            user.userRewardId = _pools[poolId].totalUsers;
        } //! no esta guardando de nuevo el pool en el user, ver porque , teoria :> capas que no pisael valor de user , cabiar la linea 78 y setear valor a valor
        user.depositTotal += amount;
        _usersRewardsPool[poolId][user.userRewardId] = user;
        // _usersRewardsPool[poolId][user.userRewardId].depositTotal = user.depositTotal;
        if (exist == false) {
            _pools[poolId].totalUsers += 1;
        }
        emit poolDeposit(poolId, amount, _pools[poolId], user);
    }

    //0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    //0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
    function loadReward(
        uint256 poolId,
        uint256 amount
    )
        public
        onlyRole(USE_ROLE)
        CanUsePool(poolId)
        HasAllowance(msg.sender, amount)
        HasBalance(msg.sender, amount)
    {
        //recibir total de amount
        _token.transferFrom(msg.sender, address(this), amount);
        // buscar % de cada usuario que participo para cargar sus dichos rewards.
        uint256 percentage = 0;
        for (uint256 i = 0; i < _pools[poolId].totalUsers; i++) {
            if (_usersRewardsPool[poolId][i].depositTotal > 0) {
                percentage =
                    (_usersRewardsPool[poolId][i].depositTotal * 100) /
                    _pools[poolId].totalPool; // obtener % de valor en el pool.
                percentage = (percentage * amount) / 100; // obtener total token to send.
                _token.approve(_usersRewardsPool[poolId][i].user, percentage);
                _usersRewardsPool[poolId][i].reward += percentage;
            }
        }
        emit poolRewards(poolId, _pools[poolId], amount);
    }

    function withDraw(uint256 poolId) public {
        UserReward memory user = findUserInPool(msg.sender, poolId);
        require(user.depositTotal > 0, "you dont have deposit");
        uint256 amount = user.depositTotal + user.reward;
        _token.transfer(msg.sender, amount);
        user.depositTotal = 0;
        user.reward = 0;
        _usersRewardsPool[poolId][user.userRewardId] = user;
        // se podria guardar esto en un nuevo mapping para tener un historial de retiros.
    }

    function updatePool(
        uint256 poolId,
        uint256 totalUsers,
        uint256 totalPool,
        int256 status
    ) public onlyRole(USE_ROLE) {
        _pools[poolId].totalUsers = totalUsers;
        _pools[poolId].totalPool = totalPool;
        _pools[poolId].status = status;
    }

    function findUserInPool(
        address user,
        uint256 poolId
    ) public view CanUsePool(poolId) returns (UserReward memory) {
        for (uint256 i = 0; i < _pools[poolId].totalUsers; i++) {
            if (_usersRewardsPool[poolId][i].user == user) {
                return _usersRewardsPool[poolId][i];
            }
        }
        return UserReward(0, 0, 0, 0, address(this));
    }

    function grantRoleUse(address _to) public onlyOwner {
        require(_to != address(0), "Invalid address");
        require(!hasRole(USE_ROLE, _to), "Role already granted");
        grantRole(USE_ROLE, _to);
    }

    function getTotalPools() public view returns (uint256) {
        return _poolsCounter;
    }

    function revokeRoleUse(address _to) public onlyOwner {
        require(
            hasRole(USE_ROLE, _to),
            "This address does not have the role of use"
        );
        revokeRole(USE_ROLE, _to);
    }

    modifier HasBalance(address user, uint256 amount) {
        uint256 balance = _token.balanceOf(user);
        require(balance >= amount, "Token balance too small");
        _;
    }
    modifier HasAllowance(address user, uint256 amount) {
        uint256 allowance = _token.allowance(user, address(this));
        require(allowance >= amount, "Token allowance too small");
        _;
    }

    modifier CanUsePool(uint256 poolId) {
        require(
            _pools[poolId].status >= 1, // se podria bloquear directamente para que no puedan participar si el pool ya esta cerrado .
            "you cannot participate in this pool"
        );
        _;
    }
}
