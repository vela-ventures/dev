import { Button } from "@/components/ui/button";
import React from "react";
// import { useBondView } from "../../../context/BondViewContext";

type ApprovePropTypes = {
  onApprove: Function;
};

export const Approve: React.FC<ApprovePropTypes> = ({ onApprove }) => {
  // const { dispatchEvent } = useBondView();

  const handleApprove = () => {
    // TXN logic effects etc.
    // dispatchEvent("CANCEL_PRESSED");
    onApprove();
  };
  return <Button onClick={handleApprove}>Approve</Button>;
};
