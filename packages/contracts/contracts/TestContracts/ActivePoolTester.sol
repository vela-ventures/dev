// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "../ActivePool.sol";

contract ActivePoolTester is ActivePool {
    
    function unprotectedIncreaseLUSDDebt(uint _amount) external {
        LUSDDebt  = LUSDDebt.add(_amount);
    }

    function unprotectedIncreaseCollateralBalance(uint _amount) external {
        collateralTokenBalance = collateralTokenBalance.add(_amount);
    }
}
