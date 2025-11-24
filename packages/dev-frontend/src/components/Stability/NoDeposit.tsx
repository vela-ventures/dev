import React, { useCallback } from "react";
import { Box, Card } from "theme-ui";
import { InfoMessage } from "../InfoMessage";
import { Button } from "../ui/button";
import { useStabilityView } from "./context/StabilityViewContext";
import { RemainingLQTY } from "./RemainingLQTY";
import { Yield } from "./Yield";

export const NoDeposit: React.FC = () => {
  const { dispatchEvent } = useStabilityView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0 flex justify-between items-center">
        Stability Pool
        <div className="flex justify-end">
          <RemainingLQTY />
        </div>
      </h1>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title="You have no GiB in the Stability Pool.">
          You can earn AR and NAU rewards by depositing GiB.
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          <div className="flex justify-start flex-1 items-center">
            <Yield />
          </div>
          <Button onClick={handleOpenTrove}>Deposit</Button>
        </div>
      </Box>
    </Card>
  );
};
