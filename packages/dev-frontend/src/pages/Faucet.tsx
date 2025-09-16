import React, { useState } from "react";
import { Box, Button, Card, Container, Flex, Heading } from "theme-ui";
import { Contract } from "@ethersproject/contracts";

import { useLiquity } from "../hooks/LiquityContext";

const FAUCET_ADDRESS = "0x35Dded4cda3d8f523F08eF00c03061b132462922";
const FAUCET_ABI = [
  "function drip()"
];

export const Faucet: React.FC = () => {
  const { liquity: { connection: { signer } } } = useLiquity();
  const [isLoading, setIsLoading] = useState(false);

  const faucetContract = new Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);

  const handleDrip = async () => {
    try {
      setIsLoading(true);
      const tx = await faucetContract.drip();
      await tx.wait();
      console.log("Drip successful:", tx.hash);
    } catch (error) {
      console.error("Drip failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Heading>Faucet</Heading>
        <Box sx={{ p: [2, 3] }}>
          <Box>Click the button to drip test AR.</Box>
          <Flex variant="layout.actions">
            <Button onClick={handleDrip} disabled={isLoading}>
              {isLoading ? "Dripping..." : "Drip"}
            </Button>
          </Flex>
        </Box>
      </Card>
    </Container>
  );
};
