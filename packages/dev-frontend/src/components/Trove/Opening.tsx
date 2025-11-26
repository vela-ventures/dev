import {
  Decimal,
  LiquityStoreState,
  LUSD_LIQUIDATION_RESERVE,
  LUSD_MINIMUM_NET_DEBT,
  Percent,
  Trove
} from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { HistoryIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useArweaveBalance } from "../../hooks/useArweaveBalance";
import { useStableTroveChange } from "../../hooks/useStableTroveChange";
import { COIN } from "../../strings";
import { InfoBubble } from "../InfoBubble";
import { InfoIcon } from "../InfoIcon";
import { LoadingOverlay } from "../LoadingOverlay";
import { useMyTransactionState } from "../Transaction";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { CollateralRatio, CollateralRatioInfoBubble } from "./CollateralRatio";
import { EditableRow, StaticRow } from "./Editor";
import { ExpensiveTroveChangeWarning, GasEstimationState } from "./ExpensiveTroveChangeWarning";
import { TroveAction } from "./TroveAction";
import { useTroveView } from "./context/TroveViewContext";
import {
  selectForTroveChangeValidation,
  validateTroveChange
} from "./validation/validateTroveChange";

const selector = (state: LiquityStoreState) => {
  const { fees, price } = state;
  return {
    fees,
    price,
    validationContext: selectForTroveChangeValidation(state)
  };
};

const EMPTY_TROVE = new Trove(Decimal.ZERO, Decimal.ZERO);
const TRANSACTION_ID = "trove-creation";

export const Opening: React.FC = () => {
  const { dispatchEvent } = useTroveView();
  const { fees, price, validationContext } = useLiquitySelector(selector);
  // const { liquity } = useLiquity();
  const arweaveBalance = useArweaveBalance();
  const borrowingRate = fees.borrowingRate();
  const editingState = useState<string>();

  const [collateral, setCollateral] = useState<Decimal>(Decimal.ZERO);
  const [borrowAmount, setBorrowAmount] = useState<Decimal>(Decimal.ZERO);

  const maxBorrowingRate = borrowingRate.add(0.005);

  const fee = borrowAmount.mul(borrowingRate);
  const feePct = new Percent(borrowingRate);
  const totalDebt = borrowAmount.add(LUSD_LIQUIDATION_RESERVE).add(fee);
  const isDirty = !collateral.isZero || !borrowAmount.isZero;
  const trove = isDirty ? new Trove(collateral, totalDebt) : EMPTY_TROVE;
  // arweaveBalance is the AR token balance, can use full amount for collateral
  const maxCollateral = arweaveBalance;
  const collateralMaxedOut = collateral.eq(maxCollateral);
  const collateralRatio =
    !collateral.isZero && !borrowAmount.isZero ? trove.collateralRatio(price) : undefined;

  const [troveChange, description] = validateTroveChange(
    EMPTY_TROVE,
    trove,
    borrowingRate,
    validationContext,
    arweaveBalance
  );

  const stableTroveChange = useStableTroveChange(troveChange);
  const [gasEstimationState, setGasEstimationState] = useState<GasEstimationState>({ type: "idle" });

  const transactionState = useMyTransactionState(TRANSACTION_ID);
  const isTransactionPending =
    transactionState.type === "waitingForApproval" ||
    transactionState.type === "waitingForConfirmation";

  const handleCancelPressed = useCallback(() => {
    dispatchEvent("CANCEL_ADJUST_TROVE_PRESSED");
  }, [dispatchEvent]);

  const reset = useCallback(() => {
    setCollateral(Decimal.ZERO);
    setBorrowAmount(Decimal.ZERO);
  }, []);

  useEffect(() => {
    if (!collateral.isZero && borrowAmount.isZero) {
      setBorrowAmount(LUSD_MINIMUM_NET_DEBT);
    }
  }, [collateral, borrowAmount]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Vault
          {isDirty && !isTransactionPending && (
            <Button
              variant="link"
              className="hover:enabled:text-destructive"
              onClick={reset}
            >
              <HistoryIcon className="size-6"/>
            </Button>
          )}
        </CardTitle>
        <CardDescription>Borrow GiB with AR as collateral</CardDescription>
      </CardHeader>

      <CardContent>
        <EditableRow
          label="Collateral"
          inputId="trove-collateral"
          amount={collateral.prettify(4)}
          maxAmount={maxCollateral.toString()}
          maxedOut={collateralMaxedOut}
          editingState={editingState}
          unit="AR"
          editedAmount={collateral.toString(4)}
          setEditedAmount={(amount: string) => setCollateral(Decimal.from(amount))}
        />

        <EditableRow
          label="Borrow"
          inputId="trove-borrow-amount"
          amount={borrowAmount.prettify()}
          unit={COIN}
          editingState={editingState}
          editedAmount={borrowAmount.toString(2)}
          setEditedAmount={(amount: string) => setBorrowAmount(Decimal.from(amount))}
        />

        <StaticRow
          label="Liquidation Reserve"
          inputId="trove-liquidation-reserve"
          amount={`${LUSD_LIQUIDATION_RESERVE}`}
          unit={COIN}
          infoIcon={
            <InfoIcon
              tooltip={
                <div className="w-[200px]">
                  An amount set aside to cover the liquidator's gas costs if your Vault needs to be
                  liquidated. The amount increases your debt and is refunded if you close your Vault
                  by fully paying off its net debt.
                </div>
              }
            />
          }
        />

        <StaticRow
          label="Borrowing Fee"
          inputId="trove-borrowing-fee"
          amount={fee.prettify(2)}
          pendingAmount={feePct.toString(2)}
          unit={COIN}
          infoIcon={
            <InfoIcon
              tooltip={
                <div className="w-[240px]">
                  This amount is deducted from the borrowed amount as a one-time fee. There are no
                  recurring fees for borrowing, which is thus interest-free.
                </div>
              }
            />
          }
        />

        <StaticRow
          label="Total debt"
          inputId="trove-total-debt"
          amount={totalDebt.prettify(2)}
          unit={COIN}
          infoIcon={
            <InfoIcon
              tooltip={
                <div className="w-[240px]">
                  The total amount of GiB your Vault will hold.{" "}
                  {isDirty && (
                    <>
                      You will need to repay {totalDebt.sub(LUSD_LIQUIDATION_RESERVE).prettify(2)}{" "}
                      GiB to reclaim your collateral ({LUSD_LIQUIDATION_RESERVE.toString()} GiB
                      Liquidation Reserve excluded).
                    </>
                  )}
                </div>
              }
            />
          }
        />

        <CollateralRatio value={collateralRatio} />

        <InfoBubble>
          Keep your collateral ratio above the{" "}
          <Link to="/risky-troves" className="underline hover:text-primary">
            riskiest Vaults
          </Link>{" "}
          to avoid being redeemed.
          {/* <LearnMoreLink link="https://docs.liquity.org/faq/lusd-redemptions#how-can-i-avoid-being-redeemed-against">
            redeemed.
          </LearnMoreLink> */}
        </InfoBubble>

        <CollateralRatioInfoBubble value={collateralRatio} />

        {description ?? (
          <InfoBubble>
            Start by entering the amount of AR you'd like to deposit as collateral.
          </InfoBubble>
        )}

        <ExpensiveTroveChangeWarning
          troveChange={stableTroveChange}
          maxBorrowingRate={maxBorrowingRate}
          borrowingFeeDecayToleranceMinutes={60}
          gasEstimationState={gasEstimationState}
          setGasEstimationState={setGasEstimationState}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancelPressed}>
            Cancel
          </Button>

          {gasEstimationState.type === "inProgress" ? (
            <Button disabled>
              <Spinner />
            </Button>
          ) : stableTroveChange ? (
            <TroveAction
              transactionId={TRANSACTION_ID}
              change={stableTroveChange}
              maxBorrowingRate={maxBorrowingRate}
              borrowingFeeDecayToleranceMinutes={60}
            >
              Confirm
            </TroveAction>
          ) : (
            <Button disabled>Confirm</Button>
          )}
        </div>
      </CardContent>
      {isTransactionPending && <LoadingOverlay />}
    </Card>
  );
};
