import React from "react";
import { Paragraph } from "theme-ui";
import { InfoMessage } from "../components/InfoMessage";
import { LiquidationManager } from "../components/LiquidationManager";
import { RiskyTroves } from "../components/RiskyTroves";
import { SystemStats } from "../components/SystemStats";

export const RiskyTrovesPage: React.FC = () => (
  <div className="grid grid-cols-5 gap-8 w-full">
    <div className="col-span-3">
      <InfoMessage title="Bot functionality">
        <Paragraph>Liquidation is expected to be carried out by bots.</Paragraph>
        <Paragraph>
          Early on you may be able to manually liquidate Vaults, but as the system matures this
          will become less likely.
        </Paragraph>
      </InfoMessage>
      <LiquidationManager />
    </div>

    <div className="col-span-2">
      <SystemStats />
    </div>

    <div className="col-span-5">
      <RiskyTroves pageSize={10} />
    </div>
  </div>
);
