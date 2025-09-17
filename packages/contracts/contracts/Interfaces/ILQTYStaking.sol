// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

interface ILQTYStaking {

    // --- Events --
    
    event LQTYTokenAddressSet(address _lqtyTokenAddress);
    event LUSDTokenAddressSet(address _lusdTokenAddress);
    event TroveManagerAddressSet(address _troveManager);
    event BorrowerOperationsAddressSet(address _borrowerOperationsAddress);
    event ActivePoolAddressSet(address _activePoolAddress);

    event StakeChanged(address indexed staker, uint newStake);
    event StakingGainsWithdrawn(address indexed staker, uint LUSDGain, uint collateralGain);
    event F_CollateralUpdated(uint _F_Collateral);
    event F_LUSDUpdated(uint _F_LUSD);
    event TotalLQTYStakedUpdated(uint _totalLQTYStaked);
    event CollateralSent(address _account, uint _amount);
    event StakerSnapshotsUpdated(address _staker, uint _F_Collateral, uint _F_LUSD);

    // --- Functions ---

    function setAddresses
    (
        address _lqtyTokenAddress,
        address _lusdTokenAddress,
        address _troveManagerAddress, 
        address _borrowerOperationsAddress,
        address _activePoolAddress
    )  external;

    function stake(uint _LQTYamount) external;

    function unstake(uint _LQTYamount) external;

    function increaseF_Collateral(uint _collateralFee) external; 

    function increaseF_LUSD(uint _LQTYFee) external;  

    function getPendingCollateralGain(address _user) external view returns (uint);

    function getPendingLUSDGain(address _user) external view returns (uint);
}
