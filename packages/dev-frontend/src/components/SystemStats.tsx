import { Decimal, LiquityStoreState, Percent } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

import * as l from "../lexicon";
import { Statistic } from "./Statistic";

const selectBalances = ({ accountBalance, lusdBalance, lqtyBalance }: LiquityStoreState) => ({
  accountBalance,
  lusdBalance,
  lqtyBalance
});

const Balances: React.FC = () => {
  const { accountBalance, lusdBalance, lqtyBalance } = useLiquitySelector(selectBalances);

  return (
    <div className="mb-3">
      <h1 className="text-lg font-semibold">My Account Balances</h1>
      <Statistic lexicon={l.ETH}>{accountBalance.prettify(4)}</Statistic>
      <Statistic lexicon={l.LUSD}>{lusdBalance.prettify()}</Statistic>
      <Statistic lexicon={l.LQTY}>{lqtyBalance.prettify()}</Statistic>
    </div>
  );
};

// const GitHubCommit: React.FC<{ children?: string }> = ({ children }) =>
//   children?.match(/[0-9a-f]{40}/) ? (
//     <Link href={`https://github.com/liquity/dev/commit/${children}`}>{children.substr(0, 7)}</Link>
//   ) : (
//     <>unknown</>
//   );

type SystemStatsProps = {
  variant?: string;
  showBalances?: boolean;
};

const select = ({
  numberOfTroves,
  price,
  total,
  lusdInStabilityPool,
  borrowingRate,
  redemptionRate,
  totalStakedLQTY,
  frontend
}: LiquityStoreState) => ({
  numberOfTroves,
  price,
  total,
  lusdInStabilityPool,
  borrowingRate,
  redemptionRate,
  totalStakedLQTY,
  kickbackRate: frontend.status === "registered" ? frontend.kickbackRate : null
});

export const SystemStats: React.FC<SystemStatsProps> = ({ variant = "info", showBalances }) => {
  // const {
  //   liquity: {
  //     connection: { version: contractsVersion, deploymentDate, frontendTag }
  //   }
  // } = useLiquity();

  const {
    numberOfTroves,
    price,
    lusdInStabilityPool,
    total,
    borrowingRate,
    totalStakedLQTY
    // kickbackRate
  } = useLiquitySelector(select);

  const lusdInStabilityPoolPct =
    total.debt.nonZero && new Percent(lusdInStabilityPool.div(total.debt));
  const totalCollateralRatioPct = new Percent(total.collateralRatio(price));
  const borrowingFeePct = new Percent(borrowingRate);
  // const kickbackRatePct = frontendTag === AddressZero ? "100" : kickbackRate?.mul(100).prettify();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>NAU statistics</CardTitle>
        <CardDescription>Protocol</CardDescription>
      </CardHeader>

      <CardContent>
        <Statistic lexicon={l.BORROW_FEE}>{borrowingFeePct.toString(2)}</Statistic>

        <Statistic lexicon={l.TVL}>
          {total.collateral.shorten()} <span className="text-sm">&nbsp;ETH</span>
          <span className="text-sm">
            &nbsp;(${Decimal.from(total.collateral.mul(price)).shorten()})
          </span>
        </Statistic>
        <Statistic lexicon={l.TROVES}>{Decimal.from(numberOfTroves).prettify(0)}</Statistic>
        <Statistic lexicon={l.LUSD_SUPPLY}>{total.debt.shorten()}</Statistic>
        {lusdInStabilityPoolPct && (
          <Statistic lexicon={l.STABILITY_POOL_LUSD}>
            {lusdInStabilityPool.shorten()}
            <span className="text-sm">&nbsp;({lusdInStabilityPoolPct.toString(1)})</span>
          </Statistic>
        )}
        <Statistic lexicon={l.STAKED_LQTY}>{totalStakedLQTY.shorten()}</Statistic>
        <Statistic lexicon={l.TCR}>{totalCollateralRatioPct.prettify()}</Statistic>
        <Statistic lexicon={l.RECOVERY_MODE}>
          {total.collateralRatioIsBelowCritical(price) ? <div color="danger">Yes</div> : "No"}
        </Statistic>

        {showBalances && <Balances />}
      </CardContent>

      {/* <Heading as="h2" sx={{ mt: 3, fontWeight: "body" }}>
        Frontend
      </Heading>
      {kickbackRatePct && <Statistic lexicon={l.KICKBACK_RATE}>{kickbackRatePct}%</Statistic>}

      <Box sx={{ mt: 3, opacity: 0.66 }}>
        <Box sx={{ fontSize: 0 }}>
          Contracts version: <GitHubCommit>{contractsVersion}</GitHubCommit>
        </Box>
        <Box sx={{ fontSize: 0 }}>Deployed: {deploymentDate.toLocaleString()}</Box>
        <Box sx={{ fontSize: 0 }}>
          Frontend version:{" "}
          {import.meta.env.DEV ? (
            "development"
          ) : (
            <GitHubCommit>{import.meta.env.VITE_APP_VERSION}</GitHubCommit>
          )}
        </Box>
      </Box> */}
    </Card>
  );
};
