import React, { useCallback } from "react";
import { Box, Heading } from "theme-ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoMessage } from "../InfoMessage";
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
      <Heading>
        Stability Pool
        <div className="flex justify-end">
          <RemainingLQTY />
        </div>
      </Heading>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title="You have no GiB in the Stability Pool.">
          You can earn AR and NAU rewards by depositing GiB.
        </InfoMessage>

        <div className="flex" style={{ variant: "layout.actions" }}>
          <div className="flex justify-start items-center" style={{ flex: 1 }}>
            <Yield />
          </div>
          <Button onClick={handleOpenTrove}>Deposit</Button>
        </div>
      </Box>
    </Card>
  );
};
