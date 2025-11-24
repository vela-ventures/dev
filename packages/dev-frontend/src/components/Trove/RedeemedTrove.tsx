import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React, { useCallback } from "react";
import { Box, Card } from "theme-ui";
import { CollateralSurplusAction } from "../CollateralSurplusAction";
import { InfoMessage } from "../InfoMessage";
import { Button } from "../ui/button";
import { useTroveView } from "./context/TroveViewContext";

const select = ({ collateralSurplusBalance }: LiquityStoreState) => ({
  hasSurplusCollateral: !collateralSurplusBalance.isZero
});

export const RedeemedTrove: React.FC = () => {
  const { hasSurplusCollateral } = useLiquitySelector(select);
  const { dispatchEvent } = useTroveView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("OPEN_TROVE_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0">Vault</h1>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title="Your Vault has been redeemed.">
          {hasSurplusCollateral
            ? "Please reclaim your remaining collateral before opening a new Vault."
            : "You can borrow GiB by opening a Vault."}
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          {hasSurplusCollateral && <CollateralSurplusAction />}
          {!hasSurplusCollateral && <Button onClick={handleOpenTrove}>Open Vault</Button>}
        </div>
      </Box>
    </Card>
  );
};
