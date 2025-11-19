import { Button } from "@/components/ui/button";
import React, { useCallback } from "react";
import { Box, Heading } from "theme-ui";
import { Card } from "@/components/ui/card";
import { InfoMessage } from "../InfoMessage";
import { useTroveView } from "./context/TroveViewContext";

export const NoTrove: React.FC = () => {
  const { dispatchEvent } = useTroveView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("OPEN_TROVE_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card>
      <Heading>Vault</Heading>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title="You haven't borrowed any GiB yet.">
          You can borrow GiB by opening a Vault.
        </InfoMessage>

        <div className="flex" style={{ variant: "layout.actions" }}>
          <Button onClick={handleOpenTrove}>Open Vault</Button>
        </div>
      </Box>
    </Card>
  );
};
