import React from "react";
import { Box, Flex, Heading, Text } from "theme-ui";
import { Button } from "./ui/button";

import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { useLiquity } from "../hooks/LiquityContext";
import { useArweaveBalance } from "../hooks/useArweaveBalance";
import { COIN, GT } from "../strings";
import { shortenAddress } from "../utils/shortenAddress";

import { ConnectKitButton } from "connectkit";
import { CircleUserIcon, WalletIcon } from "lucide-react";
import { useBondAddresses } from "./Bonds/context/BondAddressesContext";
import { useBondView } from "./Bonds/context/BondViewContext";

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
    <Flex>
      <ConnectKitButton.Custom>
        {connectKit => (
          <Button
            variant="outline"
            className="items-center p-2 mr-3"
            onClick={connectKit.show}
          >
            <CircleUserIcon/> {shortenAddress(account)}
          </Button>
        )}
      </ConnectKitButton.Custom>

      <Box
        sx={{
          display: ["none", "flex"],
          alignItems: "center"
        }}
      >
        <WalletIcon/>

        {([
          ["LOAD", accountBalance],
          ["AR", arweaveBalance],
          [COIN, Decimal.from(lusdBalance || 0)],
          [GT, Decimal.from(lqtyBalance)]
          // ["bLUSD", Decimal.from(bLusdBalance || 0)]
        ] as const).map(([currency, balance], i) => (
          <Flex key={i} sx={{ ml: 3, flexDirection: "column" }}>
            <Heading sx={{ fontSize: 1 }}>{currency}</Heading>
            <Text sx={{ fontSize: 1 }}>{balance.prettify()}</Text>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};
