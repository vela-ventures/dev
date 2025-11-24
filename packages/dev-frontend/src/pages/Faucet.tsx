import { Button } from "@/components/ui/button";
import { Contract } from "@ethersproject/contracts";
import { DropletIcon } from "lucide-react";
import React, { useState } from "react";
import { Box, Card, Container } from "theme-ui";

import { useLiquity } from "../hooks/LiquityContext";

const FAUCET_ADDRESS = "0xBBC0157d436fe4dFbAfaA12b6af330b11588c4FE";
const FAUCET_ABI = ["function drip()"];

export const Faucet: React.FC = () => {
  const {
    liquity: {
      connection: { signer }
    }
  } = useLiquity();
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
        <h1 className="text-lg font-semibold p-4 pb-0">Faucet</h1>
        <Box sx={{ p: [2, 3] }}>
          <Box>Click the button to drip test AR.</Box>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleDrip} disabled={isLoading}>
              <DropletIcon/> {isLoading ? "Dripping..." : "Drip"}
            </Button>
          </div>
        </Box>
      </Card>
    </Container>
  );
};
