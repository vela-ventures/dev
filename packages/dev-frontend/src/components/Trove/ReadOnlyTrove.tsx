import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { PencilIcon } from "lucide-react";
import React, { useCallback } from "react";
import { COIN } from "../../strings";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Vault</CardTitle>
        <CardDescription>Borrow GiB with AR as collateral</CardDescription>
      </CardHeader>
      <CardContent>
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
          </CardContent>

        <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCloseTrove}>
            Close Vault
          </Button>
          <Button onClick={handleAdjustTrove}>
            <PencilIcon/> Adjust
          </Button>
        </CardFooter>
    </Card>
  );
};
