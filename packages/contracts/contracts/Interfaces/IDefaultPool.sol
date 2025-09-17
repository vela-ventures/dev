// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "./IPool.sol";


interface IDefaultPool is IPool {
    // --- Events ---
    event TroveManagerAddressChanged(address _newTroveManagerAddress);
    event DefaultPoolLUSDDebtUpdated(uint _LUSDDebt);
    event DefaultPoolCollateralBalanceUpdated(uint _amount);

    // --- Functions ---
    function sendCollateralToActivePool(uint _amount) external;
    function depositCollateral(uint _amount) external;
    function increaseCollateralBalance(uint _amount) external;
}
