import React, { useState } from "react";
import { Box, Heading, Label } from "theme-ui";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useLiquity } from "../hooks/LiquityContext";

import { Button } from "@/components/ui/button";
import { Icon } from "./Icon";
import { Transaction } from "./Transaction";

export const LiquidationManager: React.FC = () => {
  const {
    liquity: { send: liquity }
  } = useLiquity();
  const [numberOfTrovesToLiquidate, setNumberOfTrovesToLiquidate] = useState("90");

  return (
    <Card>
      <Heading>Liquidate</Heading>

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

          <div className="flex items-center ml-2">
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
              <Button variant="dangerIcon">
                <Icon name="trash" size="lg" />
              </Button>
            </Transaction>
          </div>
        </div>
      </Box>
    </Card>
  );
};
