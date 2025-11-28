import React from "react";
import { Button } from "./ui/button";

import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { useLiquity } from "../hooks/LiquityContext";
import { useArweaveBalance } from "../hooks/useArweaveBalance";
import { COIN, GT } from "../strings";
import { shortenAddress } from "../utils/shortenAddress";

import { ConnectKitButton } from "connectkit";
import { CircleUserIcon, WalletIcon } from "lucide-react";

const select = ({ accountBalance, lusdBalance, lqtyBalance }: LiquityStoreState) => ({
  accountBalance,
  lusdBalance,
  lqtyBalance
});

export const UserAccount: React.FC = () => {
  const { account } = useLiquity();
  const { accountBalance, lusdBalance, lqtyBalance } = useLiquitySelector(select);
  const arweaveBalance = useArweaveBalance();

  return (
    <div className="flex items-center">
      <ConnectKitButton.Custom>
        {connectKit => (
          <Button
            variant="outline"
            className="items-center p-2 md:mr-3"
            onClick={connectKit.show}
          >
            <CircleUserIcon/> {shortenAddress(account)}
          </Button>
        )}
      </ConnectKitButton.Custom>

      <div className="hidden md:flex items-center mr-3">
        <WalletIcon/>

        {([
          ["LOAD", accountBalance],
          ["AR", arweaveBalance],
          [COIN, Decimal.from(lusdBalance || 0)],
          [GT, Decimal.from(lqtyBalance)]
          // ["bLUSD", Decimal.from(bLusdBalance || 0)]
        ] as const).map(([currency, balance], i) => (
          <div key={i} className="flex flex-col ml-3">
            <h1 className="text-sm font-semibold">{currency}</h1>
            <span className="text-sm">{balance.prettify()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
