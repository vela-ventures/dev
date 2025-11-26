import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@ethersproject/contracts";
import { DropletIcon } from "lucide-react";
import React, { useState } from "react";

import { SystemStats } from "../components/SystemStats";
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full items-start">
      <Card className="mt-8 mx-4 md:mx-0 md:col-span-3">
        <CardHeader>
          <CardTitle>Faucet</CardTitle>
          <CardDescription>Click the button to drip test AR.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button onClick={handleDrip} disabled={isLoading}>
            <DropletIcon /> {isLoading ? "Dripping..." : "Drip"}
          </Button>
        </CardFooter>
      </Card>
      <div className="hidden md:block md:col-span-2">
        <SystemStats />
      </div>
    </div>
  );
};
