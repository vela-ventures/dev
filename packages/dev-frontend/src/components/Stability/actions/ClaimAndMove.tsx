import { Button } from "@/components/ui/button";
import React from "react";
import { useLiquity } from "../../../hooks/LiquityContext";
import { useTransactionFunction } from "../../Transaction";

type ClaimAndMoveProps = React.PropsWithChildren<{
  disabled?: boolean;
}>;

export const ClaimAndMove: React.FC<ClaimAndMoveProps> = ({ disabled, children }) => {
  const { liquity } = useLiquity();

  const [sendTransaction] = useTransactionFunction(
    "stability-deposit",
    liquity.send.transferCollateralGainToTrove.bind(liquity.send)
  );

  return (
    <Button
      variant="outline"
      className="mt-3 w-full"
      onClick={sendTransaction}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
