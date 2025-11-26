import React, { useCallback, useEffect } from "react";
import { Button } from "../ui/button";

import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { PencilIcon } from "lucide-react";
import { COIN, GT } from "../../strings";
import { InfoIcon } from "../InfoIcon";
import { LoadingOverlay } from "../LoadingOverlay";
import { useMyTransactionState } from "../Transaction";
import { DisabledEditableRow, StaticRow } from "../Trove/Editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ClaimAndMove } from "./actions/ClaimAndMove";
import { ClaimRewards } from "./actions/ClaimRewards";
import { useStabilityView } from "./context/StabilityViewContext";
import { RemainingLQTY } from "./RemainingLQTY";
import { Yield } from "./Yield";

const selector = ({ stabilityDeposit, trove, lusdInStabilityPool }: LiquityStoreState) => ({
  stabilityDeposit,
  trove,
  lusdInStabilityPool
});

export const ActiveDeposit: React.FC = () => {
  const { dispatchEvent } = useStabilityView();
  const { stabilityDeposit, trove, lusdInStabilityPool } = useLiquitySelector(selector);

  const poolShare = stabilityDeposit.currentLUSD.mulDiv(100, lusdInStabilityPool);

  const handleAdjustDeposit = useCallback(() => {
    dispatchEvent("ADJUST_DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  const hasReward = !stabilityDeposit.lqtyReward.isZero;
  const hasGain = !stabilityDeposit.collateralGain.isZero;
  const hasTrove = !trove.isEmpty;

  const transactionId = "stability-deposit";
  const transactionState = useMyTransactionState(transactionId);
  const isWaitingForTransaction =
    transactionState.type === "waitingForApproval" ||
    transactionState.type === "waitingForConfirmation";

  useEffect(() => {
    if (transactionState.type === "confirmedOneShot") {
      dispatchEvent("REWARDS_CLAIMED");
    }
  }, [transactionState.type, dispatchEvent]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Stability Pool
          {!isWaitingForTransaction && (
            <div className="flex justify-end">
              <RemainingLQTY />
            </div>
          )}
        </CardTitle>
        <CardDescription>Supply GiB and earn NAU</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <DisabledEditableRow
            label="Deposit"
            inputId="deposit-lusd"
            amount={stabilityDeposit.currentLUSD.prettify()}
            unit={COIN}
          />

          <StaticRow
            label="Pool share"
            inputId="deposit-share"
            amount={poolShare.prettify(4)}
            unit="%"
          />

          <StaticRow
            label="Liquidation gain"
            inputId="deposit-gain"
            amount={stabilityDeposit.collateralGain.prettify(4)}
            color={stabilityDeposit.collateralGain.nonZero && "success"}
            unit="AR"
          />

          <div className="flex items-center">
            <StaticRow
              label="Reward"
              inputId="deposit-reward"
              amount={stabilityDeposit.lqtyReward.prettify()}
              color={stabilityDeposit.lqtyReward.nonZero && "success"}
              unit={GT}
              infoIcon={
                <InfoIcon
                  tooltip={
                    <div className="w-[240px]">
                      Although the NAU rewards accrue every minute, the value on the UI only updates
                      when a user transacts with the Stability Pool. Therefore you may receive more
                      rewards than is displayed when you claim or adjust your deposit.
                    </div>
                  }
                />
              }
            />
            <div className="flex justify-end flex-shrink-0">
              <Yield />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button size="lg" variant="outline" onClick={handleAdjustDeposit}>
            <PencilIcon/> Adjust
          </Button>

          <ClaimRewards disabled={!hasGain && !hasReward}>Claim AR and NAU</ClaimRewards>
        </div>

        {hasTrove && <ClaimAndMove disabled={!hasGain}>Claim NAU and move AR to Vault</ClaimAndMove>}
      </CardContent>

      {isWaitingForTransaction && <LoadingOverlay />}
    </Card>
  );
};
