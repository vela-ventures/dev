import React, { useCallback } from "react";
import { Box, Card } from "theme-ui";
import { InfoMessage } from "../InfoMessage";
import { Button } from "../ui/button";
import { useTroveView } from "./context/TroveViewContext";

export const NoTrove: React.FC = () => {
  const { dispatchEvent } = useTroveView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("OPEN_TROVE_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0">Vault</h1>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title="You haven't borrowed any GiB yet.">
          You can borrow GiB by opening a Vault.
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleOpenTrove}>Open Vault</Button>
        </div>
      </Box>
    </Card>
  );
};
