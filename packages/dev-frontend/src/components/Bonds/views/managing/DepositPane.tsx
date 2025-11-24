import { Button } from "@/components/ui/button";
import { Decimal } from "@liquity/lib-base";
import { MoveDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, Checkbox, Label, Spinner } from "theme-ui";
import { Amount } from "../../../ActionDescription";
import { ErrorDescription } from "../../../ErrorDescription";
import { InfoIcon } from "../../../InfoIcon";
import { DisabledEditableRow, EditableRow } from "../../../Trove/Editor";
import { useBondView } from "../../context/BondViewContext";
import type { Address, ApprovePressedPayload } from "../../context/transitions";
import { BLusdAmmTokenIndex } from "../../context/transitions";
import { PoolDetails } from "./PoolDetails";

export const DepositPane: React.FC = () => {
  const {
    dispatchEvent,
    statuses,
    lusdBalance,
    bLusdBalance,
    isBLusdApprovedWithAmmZapper,
    isLusdApprovedWithAmmZapper,
    getExpectedLpTokens,
    addresses,
    bLusdAmmBLusdBalance,
    bLusdAmmLusdBalance
  } = useBondView();

  const editingState = useState<string>();
  const [bLusdAmount, setBLusdAmount] = useState<Decimal>(Decimal.ZERO);
  const [lusdAmount, setLusdAmount] = useState<Decimal>(Decimal.ZERO);
  const [lpTokens, setLpTokens] = useState<Decimal>(Decimal.ZERO);
  const [shouldStakeInGauge, setShouldStakeInGauge] = useState(true);
  const [shouldDepositBalanced, setShouldDepositBalanced] = useState(true);

  const coalescedBLusdBalance = bLusdBalance ?? Decimal.ZERO;
  const coalescedLusdBalance = lusdBalance ?? Decimal.ZERO;

  const isApprovePending = statuses.APPROVE_SPENDER === "PENDING";
  const isManageLiquidityPending = statuses.MANAGE_LIQUIDITY === "PENDING";
  const isBLusdBalanceInsufficient = bLusdAmount.gt(coalescedBLusdBalance);
  const isLusdBalanceInsufficient = lusdAmount.gt(coalescedLusdBalance);
  const isAnyBalanceInsufficient = isBLusdBalanceInsufficient || isLusdBalanceInsufficient;

  const isDepositingLusd = lusdAmount.gt(0);
  const isDepositingBLusd = bLusdAmount.gt(0);

  const zapperNeedsLusdApproval = isDepositingLusd && !isLusdApprovedWithAmmZapper;
  const zapperNeedsBLusdApproval = isDepositingBLusd && !isBLusdApprovedWithAmmZapper;
  const isApprovalNeeded = zapperNeedsLusdApproval || zapperNeedsBLusdApproval;

  const poolBalanceRatio =
    bLusdAmmBLusdBalance && bLusdAmmLusdBalance
      ? bLusdAmmLusdBalance.div(bLusdAmmBLusdBalance)
      : Decimal.ONE;

  const handleApprovePressed = () => {
    const tokensNeedingApproval = new Map<BLusdAmmTokenIndex, Address>();
    if (zapperNeedsLusdApproval) {
      tokensNeedingApproval.set(BLusdAmmTokenIndex.LUSD, addresses.BLUSD_LP_ZAP_ADDRESS);
    }
    if (zapperNeedsBLusdApproval) {
      tokensNeedingApproval.set(BLusdAmmTokenIndex.BLUSD, addresses.BLUSD_LP_ZAP_ADDRESS);
    }

    dispatchEvent("APPROVE_PRESSED", { tokensNeedingApproval } as ApprovePressedPayload);
  };

  const handleConfirmPressed = () => {
    dispatchEvent("CONFIRM_PRESSED", {
      action: "addLiquidity",
      bLusdAmount,
      lusdAmount,
      minLpTokens: lpTokens,
      shouldStakeInGauge
    });
  };

  const handleBackPressed = () => {
    dispatchEvent("BACK_PRESSED");
  };

  const handleToggleShouldStakeInGauge = () => {
    setShouldStakeInGauge(toggle => !toggle);
  };

  const handleToggleShouldDepositBalanced = () => {
    if (!shouldDepositBalanced) {
      setBLusdAmount(Decimal.ZERO);
      setLusdAmount(Decimal.ZERO);
    }
    setShouldDepositBalanced(toggle => !toggle);
  };

  const handleSetAmount = (token: "bLUSD" | "LUSD", amount: Decimal) => {
    if (shouldDepositBalanced) {
      if (token === "bLUSD") setLusdAmount(poolBalanceRatio.mul(amount));
      else if (token === "LUSD") setBLusdAmount(amount.div(poolBalanceRatio));
    }

    if (token === "bLUSD") setBLusdAmount(amount);
    else if (token === "LUSD") setLusdAmount(amount);
  };

  useEffect(() => {
    if (bLusdAmount.isZero && lusdAmount.isZero) {
      setLpTokens(Decimal.ZERO);
      return;
    }

    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      try {
        const expectedLpTokens = await getExpectedLpTokens(bLusdAmount, lusdAmount);
        if (cancelled) return;
        setLpTokens(expectedLpTokens);
      } catch (error) {
        console.error("getExpectedLpTokens() failed");
        console.log(error);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      cancelled = true;
    };
  }, [bLusdAmount, lusdAmount, getExpectedLpTokens]);

  return (
    <>
      <EditableRow
        label="bLUSD amount"
        inputId="deposit-blusd"
        amount={bLusdAmount.prettify(2)}
        unit="bLUSD"
        editingState={editingState}
        editedAmount={bLusdAmount.toString()}
        setEditedAmount={amount => handleSetAmount("bLUSD", Decimal.from(amount))}
        maxAmount={coalescedBLusdBalance.toString()}
        maxedOut={bLusdAmount.eq(coalescedBLusdBalance)}
      />

      <EditableRow
        label="LUSD amount"
        inputId="deposit-lusd"
        amount={lusdAmount.prettify(2)}
        unit="LUSD"
        editingState={editingState}
        editedAmount={lusdAmount.toString()}
        setEditedAmount={amount => handleSetAmount("LUSD", Decimal.from(amount))}
        maxAmount={coalescedLusdBalance.toString()}
        maxedOut={lusdAmount.eq(coalescedLusdBalance)}
      />

      <div className="flex justify-center mb-3">
        <MoveDownIcon/>
      </div>

      <DisabledEditableRow
        label="Mint LP tokens"
        inputId="deposit-mint-lp-tokens"
        amount={lpTokens.prettify(2)}
      />

      <Label>
        <div className="flex items-center">
          <Checkbox checked={shouldDepositBalanced} onChange={handleToggleShouldDepositBalanced} />
          <span className="font-light text-base">Deposit tokens in a balanced ratio</span>
          <InfoIcon
            placement="right"
            tooltip={
              <Card variant="tooltip">
                Tick this box to deposit bLUSD and LUSD-3CRV in the pool's current liquidity ratio.
                Current ratio = 1 bLUSD : {poolBalanceRatio.prettify(2)} LUSD.
              </Card>
            }
          />
        </div>
      </Label>

      <Label mb={2}>
        <div className="flex items-center">
          <Checkbox checked={shouldStakeInGauge} onChange={handleToggleShouldStakeInGauge} />
          <span className="font-light text-base">Stake LP tokens in Curve gauge</span>
          <InfoIcon
            placement="right"
            tooltip={
              <Card variant="tooltip">
                Tick this box to have your Curve LP tokens staked in the bLUSD Curve gauge. Staked LP
                tokens will earn protocol fees and Curve rewards.
              </Card>
            }
          />
        </div>
      </Label>

      <PoolDetails />

      {isAnyBalanceInsufficient && (
        <ErrorDescription>
          Deposit exceeds your balance by{" "}
          {isBLusdBalanceInsufficient && (
            <>
              <Amount>{bLusdAmount.sub(coalescedBLusdBalance).prettify(2)} bLUSD</Amount>
              {isLusdBalanceInsufficient && <> and </>}
            </>
          )}
          {isLusdBalanceInsufficient && (
            <Amount>{lusdAmount.sub(coalescedLusdBalance).prettify(2)} LUSD</Amount>
          )}
        </ErrorDescription>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={handleBackPressed}
          disabled={isApprovePending || isManageLiquidityPending}
        >
          Back
        </Button>

        {!isApprovalNeeded ? (
          <Button
            onClick={handleConfirmPressed}
            disabled={
              (bLusdAmount.isZero && lusdAmount.isZero) ||
              isAnyBalanceInsufficient ||
              isManageLiquidityPending
            }
          >
            {isManageLiquidityPending ? <Spinner size={28} sx={{ color: "white" }} /> : <>Confirm</>}
          </Button>
        ) : (
          <Button onClick={handleApprovePressed} disabled={isApprovePending}>
            {isApprovePending ? <Spinner size={28} sx={{ color: "white" }} /> : <>Approve</>}
          </Button>
        )}
      </div>
    </>
  );
};
