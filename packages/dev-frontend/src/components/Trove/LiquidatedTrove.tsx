import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React, { useCallback } from "react";
import { CollateralSurplusAction } from "../CollateralSurplusAction";
import { InfoMessage } from "../InfoMessage";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useTroveView } from "./context/TroveViewContext";

const select = ({ collateralSurplusBalance }: LiquityStoreState) => ({
  hasSurplusCollateral: !collateralSurplusBalance.isZero
});

export const LiquidatedTrove: React.FC = () => {
  const { hasSurplusCollateral } = useLiquitySelector(select);
  const { dispatchEvent } = useTroveView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("OPEN_TROVE_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Vault</CardTitle>
        <CardDescription>Borrow GiB with AR as collateral</CardDescription>
      </CardHeader>
      <CardContent>
        <InfoMessage title="Your Vault has been liquidated.">
          {hasSurplusCollateral
            ? "Please reclaim your remaining collateral before opening a new Vault."
            : "You can borrow GiB by opening a Vault."}
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          {hasSurplusCollateral && <CollateralSurplusAction />}
          {!hasSurplusCollateral && <Button onClick={handleOpenTrove}>Open Vault</Button>}
        </div>
      </CardContent>
    </Card>
  );
};
