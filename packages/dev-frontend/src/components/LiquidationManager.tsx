import React, { useState } from "react";
import { Box, Card, Input, Label } from "theme-ui";
import { useLiquity } from "../hooks/LiquityContext";
import { Button } from "./ui/button";

import { Trash2Icon } from "lucide-react";
import { Transaction } from "./Transaction";

export const LiquidationManager: React.FC = () => {
  const {
    liquity: { send: liquity }
  } = useLiquity();
  const [numberOfTrovesToLiquidate, setNumberOfTrovesToLiquidate] = useState("90");

  return (
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0">Liquidate</h1>

      <Box sx={{ p: [2, 3] }}>
        <div className="flex items-stretch">
          <Label>Up to</Label>

          <Input
            type="number"
            min="1"
            step="1"
            value={numberOfTrovesToLiquidate}
            onChange={e => setNumberOfTrovesToLiquidate(e.target.value)}
          />

          <Label>Vaults</Label>

          <div className="flex items-center">
            <Transaction
              id="batch-liquidate"
              tooltip="Liquidate"
              tooltipPlacement="bottom"
              send={overrides => {
                if (!numberOfTrovesToLiquidate) {
                  throw new Error("Invalid number");
                }
                return liquity.liquidateUpTo(parseInt(numberOfTrovesToLiquidate, 10), overrides);
              }}
            >
              <Button variant="link" className="text-destructive">
                <Trash2Icon className="size-6"/>
              </Button>
            </Transaction>
          </div>
        </div>
      </Box>
    </Card>
  );
};
