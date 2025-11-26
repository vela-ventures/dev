import React, { useCallback } from "react";
import { InfoMessage } from "../InfoMessage";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useStabilityView } from "./context/StabilityViewContext";
import { RemainingLQTY } from "./RemainingLQTY";
import { Yield } from "./Yield";

export const NoDeposit: React.FC = () => {
  const { dispatchEvent } = useStabilityView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Stability Pool
          <div className="flex justify-end">
            <RemainingLQTY />
          </div>
        </CardTitle>
        <CardDescription>Supply GiB and earn NAU</CardDescription>
      </CardHeader>
      <CardContent>
        <InfoMessage title="You have no GiB in the Stability Pool.">
          You can earn AR and NAU rewards by depositing GiB.
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          <div className="flex justify-start flex-1 items-center">
            <Yield />
          </div>
          <Button onClick={handleOpenTrove}>Deposit</Button>
        </div>
      </CardContent>
    </Card>
  );
};
