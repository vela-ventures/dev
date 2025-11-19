import React, { useEffect, useState } from "react";
import { Box, Heading } from "theme-ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Empty } from "./Empty";
import { BondList } from "./BondList";
import { useBondView } from "../../context/BondViewContext";
import { BONDS } from "../../lexicon";
import { InfoIcon } from "../../../InfoIcon";
import { BLusdAmmTokenIndex, SwapPressedPayload } from "../../context/transitions";
import { useLiquity } from "../../../../hooks/LiquityContext";
import { useBondAddresses } from "../../context/BondAddressesContext";

export const Idle: React.FC = () => {
  const { liquity } = useLiquity();
  const { LUSD_OVERRIDE_ADDRESS } = useBondAddresses();

  const { dispatchEvent, bonds, getLusdFromFaucet, lusdBalance, hasLoaded } = useBondView();
  const [chain, setChain] = useState<number>();

  useEffect(() => {
    (async () => {
      if (liquity.connection.signer === undefined || chain !== undefined) return;
      const chainId = await liquity.connection.signer.getChainId();
      setChain(chainId);
    })();
  }, [chain, liquity.connection.signer]);

  if (!hasLoaded) return null;

  const hasBonds = bonds !== undefined && bonds.length > 0;

  const showLusdFaucet = LUSD_OVERRIDE_ADDRESS !== null && lusdBalance?.eq(0);

  const handleManageLiquidityPressed = () => dispatchEvent("MANAGE_LIQUIDITY_PRESSED");

  const handleBuyBLusdPressed = () =>
    dispatchEvent("SWAP_PRESSED", { inputToken: BLusdAmmTokenIndex.LUSD } as SwapPressedPayload);

  const handleSellBLusdPressed = () =>
    dispatchEvent("SWAP_PRESSED", { inputToken: BLusdAmmTokenIndex.BLUSD } as SwapPressedPayload);

  return (
    <>
      <div className="flex mt-4 mb-3" style={{ variant: "layout.actions" }}>
        <Button variant="outline" onClick={handleManageLiquidityPressed}>
          Manage liquidity
        </Button>

        <Button variant="outline" onClick={handleBuyBLusdPressed}>
          Buy bLUSD
        </Button>

        <Button variant="outline" onClick={handleSellBLusdPressed}>
          Sell bLUSD
        </Button>

        {showLusdFaucet && (
          <Button variant={hasBonds ? "outline" : "primary"} onClick={() => getLusdFromFaucet()}>
            Get 10k LUSD
          </Button>
        )}

        {hasBonds && (
          <Button variant="primary" onClick={() => dispatchEvent("CREATE_BOND_PRESSED")}>
            Create another bond
          </Button>
        )}
      </div>

      {!hasBonds && (
        <Card>
          <Heading>
            <div className="flex">
              {BONDS.term}
              <InfoIcon
                placement="left"
                size="xs"
                tooltip={<Card variant="tooltip">{BONDS.description}</Card>}
              />
            </div>
          </Heading>
          <Box sx={{ p: [2, 3] }}>
            <Empty />

            <div className="flex mt-4" style={{ variant: "layout.actions" }}>
              <Button variant="primary" onClick={() => dispatchEvent("CREATE_BOND_PRESSED")}>
                Create bond
              </Button>
            </div>
          </Box>
        </Card>
      )}

      {hasBonds && <BondList />}
    </>
  );
};
