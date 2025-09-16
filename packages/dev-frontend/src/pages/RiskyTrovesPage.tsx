import React from "react";
import { Box, Card, Container, Paragraph } from "theme-ui";
import { InfoMessage } from "../components/InfoMessage";
import { LiquidationManager } from "../components/LiquidationManager";
import { RiskyTroves } from "../components/RiskyTroves";
import { SystemStats } from "../components/SystemStats";

export const RiskyTrovesPage: React.FC = () => (
  <Container variant="columns">
    <Container variant="left">
      <Card>
        <Box sx={{ p: [2, 3] }}>
          <InfoMessage title="Bot functionality">
            <Paragraph>Liquidation is expected to be carried out by bots.</Paragraph>
            <Paragraph>
              Early on you may be able to manually liquidate Vaults, but as the system matures this
              will become less likely.
            </Paragraph>
          </InfoMessage>
        </Box>
      </Card>
      <LiquidationManager />
    </Container>

    <Container variant="right">
      <SystemStats />
    </Container>
    <RiskyTroves pageSize={10} />
  </Container>
);
