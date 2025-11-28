import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { useLiquity } from "../hooks/LiquityContext";

import { Transaction, useMyTransactionState } from "./Transaction";
import { useTroveView } from "./Trove/context/TroveViewContext";

const select = ({ collateralSurplusBalance }: LiquityStoreState) => ({
  collateralSurplusBalance
});

export const CollateralSurplusAction: React.FC = () => {
  const { collateralSurplusBalance } = useLiquitySelector(select);
  const {
    liquity: { send: liquity }
  } = useLiquity();

  const myTransactionId = "claim-coll-surplus";
  const myTransactionState = useMyTransactionState(myTransactionId);

  const { dispatchEvent } = useTroveView();

  useEffect(() => {
    if (myTransactionState.type === "confirmedOneShot") {
      dispatchEvent("TROVE_SURPLUS_COLLATERAL_CLAIMED");
    }
  }, [myTransactionState.type, dispatchEvent]);

  return myTransactionState.type === "waitingForApproval" ? (
    <div className="flex justify-end gap-2 mt-4">
      <Button disabled className="mx-2">
        <Spinner className="mr-2 text-white size-5" />
        Waiting for your approval
      </Button>
    </div>
  ) : myTransactionState.type !== "waitingForConfirmation" &&
    myTransactionState.type !== "confirmed" ? (
    <div className="flex justify-end gap-2 mt-4">
      <Transaction
        id={myTransactionId}
        send={liquity.claimCollateralSurplus.bind(liquity, undefined)}
      >
        <Button className="mx-2">Claim {collateralSurplusBalance.prettify()} ETH</Button>
      </Transaction>
    </div>
  ) : null;
};
