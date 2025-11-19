import React from "react";
import { Box, Heading, Text } from "theme-ui";
import { Button } from "@/components/ui/button";

import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { useLiquity } from "../hooks/LiquityContext";
import { useArweaveBalance } from "../hooks/useArweaveBalance";
import { COIN, GT } from "../strings";
import { shortenAddress } from "../utils/shortenAddress";

import { ConnectKitButton } from "connectkit";
import { useBondAddresses } from "./Bonds/context/BondAddressesContext";
import { useBondView } from "./Bonds/context/BondViewContext";
import { Icon } from "./Icon";

const select = ({ accountBalance, lusdBalance, lqtyBalance }: LiquityStoreState) => ({
  accountBalance,
  lusdBalance,
  lqtyBalance
});

export const UserAccount: React.FC = () => {
  const { account } = useLiquity();
  const { accountBalance, lusdBalance: realLusdBalance, lqtyBalance } = useLiquitySelector(select);
  const { lusdBalance: customLusdBalance } = useBondView();
  const { LUSD_OVERRIDE_ADDRESS } = useBondAddresses();
  const arweaveBalance = useArweaveBalance();

  const lusdBalance = LUSD_OVERRIDE_ADDRESS === null ? realLusdBalance : customLusdBalance;

  return (
    <div className="flex">
      <ConnectKitButton.Custom>
        {connectKit => (
          <Button
            variant="outline"
            sx={{ alignItems: "center", p: 2, mr: 3 }}
            onClick={connectKit.show}
          >
            <Icon name="user-circle" size="lg" />
            <Text as="span" sx={{ ml: 2, fontSize: 1 }}>
              {shortenAddress(account)}
            </Text>
          </Button>
        )}
      </ConnectKitButton.Custom>

      <Box
        sx={{
          display: ["none", "flex"],
          alignItems: "center"
        }}
      >
        <Icon name="wallet" size="lg" />

        {([
          ["LOAD", accountBalance],
          ["AR", arweaveBalance],
          [COIN, Decimal.from(lusdBalance || 0)],
          [GT, Decimal.from(lqtyBalance)]
          // ["bLUSD", Decimal.from(bLusdBalance || 0)]
        ] as const).map(([currency, balance], i) => (
          <div key={i} className="flex ml-3 flex-col">
            <Heading sx={{ fontSize: 1 }}>{currency}</Heading>
            <Text sx={{ fontSize: 1 }}>{balance.prettify()}</Text>
          </div>
        ))}
      </Box>
    </div>
  );
};
