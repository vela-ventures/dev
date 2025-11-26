import React, { useCallback } from "react";
import { InfoMessage } from "../InfoMessage";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useTroveView } from "./context/TroveViewContext";

export const NoTrove: React.FC = () => {
  const { dispatchEvent } = useTroveView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("OPEN_TROVE_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Vault</CardTitle>
        <CardDescription>Borrow GiB with AR as collateral</CardDescription>
      </CardHeader>
      <CardContent>
        <InfoMessage title="You haven't borrowed any GiB yet.">
          You can borrow GiB by opening a Vault.
        </InfoMessage>
      </CardContent>
      <CardFooter className="flex justify-end">
          <Button onClick={handleOpenTrove}>Open Vault</Button>
        </CardFooter>
    </Card>
  );
};
