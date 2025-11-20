import { Button } from "@/components/ui/button";
import React from "react";
import { Spinner } from "theme-ui";
import { ActionDescription, Amount } from "../../../../../ActionDescription";
import { useBondView } from "../../../../context/BondViewContext";

export const Cancel: React.FC = () => {
  const { dispatchEvent, selectedBond: bond, statuses } = useBondView();

  const isProcessingTransaction = statuses.CANCEL === "PENDING";

  const handleConfirmPressed = () => {
    dispatchEvent("CONFIRM_PRESSED");
  };

  const handleBackPressed = () => {
    dispatchEvent("BACK_PRESSED");
  };

  if (bond === undefined) return null;

  return (
    <>
      <ActionDescription>
        You will receive your bonded <Amount>{bond.deposit.prettify(2)} LUSD</Amount> back and forgo{" "}
        <Amount>{bond.accrued.shorten()} bLUSD</Amount>
      </ActionDescription>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleBackPressed} disabled={isProcessingTransaction}>
          Back
        </Button>
        <Button onClick={handleConfirmPressed} disabled={isProcessingTransaction}>
          {!isProcessingTransaction && <>Confirm</>}
          {isProcessingTransaction && <Spinner size={28} sx={{ color: "white" }} />}
        </Button>
      </div>
    </>
  );
};
