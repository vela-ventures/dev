import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { PencilIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Box, Card } from "theme-ui";
import { COIN } from "../../strings";
import { Button } from "../ui/button";
import { CollateralRatio, CollateralRatioInfoBubble } from "./CollateralRatio";
import { DisabledEditableRow } from "./Editor";
import { useTroveView } from "./context/TroveViewContext";

const select = ({ trove, price }: LiquityStoreState) => ({ trove, price });

export const ReadOnlyTrove: React.FC = () => {
  const { dispatchEvent } = useTroveView();
  const handleAdjustTrove = useCallback(() => {
    dispatchEvent("ADJUST_TROVE_PRESSED");
  }, [dispatchEvent]);
  const handleCloseTrove = useCallback(() => {
    dispatchEvent("CLOSE_TROVE_PRESSED");
  }, [dispatchEvent]);

  const { trove, price } = useLiquitySelector(select);

  // console.log("READONLY TROVE", trove.collateral.prettify(4));
  return (
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0">Vault</h1>
      <Box sx={{ p: [2, 3] }}>
        <Box>
          <DisabledEditableRow
            label="Collateral"
            inputId="trove-collateral"
            amount={trove.collateral.prettify(4)}
            unit="AR"
          />

          <DisabledEditableRow
            label="Debt"
            inputId="trove-debt"
            amount={trove.debt.prettify()}
            unit={COIN}
          />

          <CollateralRatio value={trove.collateralRatio(price)} />
          <CollateralRatioInfoBubble value={trove.collateralRatio(price)} />
        </Box>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCloseTrove}>
            Close Vault
          </Button>
          <Button onClick={handleAdjustTrove}>
            <PencilIcon/> Adjust
          </Button>
        </div>
      </Box>
    </Card>
  );
};
