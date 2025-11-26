import { Button } from "../ui/button";

import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { COIN, GT } from "../../strings";

import { LoadingOverlay } from "../LoadingOverlay";
import { DisabledEditableRow, StaticRow } from "../Trove/Editor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

import { PencilIcon } from "lucide-react";
import { useStakingView } from "./context/StakingViewContext";
import { StakingGainsAction } from "./StakingGainsAction";

const select = ({ lqtyStake, totalStakedLQTY }: LiquityStoreState) => ({
  lqtyStake,
  totalStakedLQTY
});

export const ReadOnlyStake: React.FC = () => {
  const { changePending, dispatch } = useStakingView();
  const { lqtyStake, totalStakedLQTY } = useLiquitySelector(select);

  const poolShare = lqtyStake.stakedLQTY.mulDiv(100, totalStakedLQTY);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Staking</CardTitle>
        <CardDescription>Stake NAU and earn AR</CardDescription>
      </CardHeader>

      <CardContent>
        <DisabledEditableRow
          label="Stake"
          inputId="stake-lqty"
          amount={lqtyStake.stakedLQTY.prettify()}
          unit={GT}
        />

        <StaticRow
          label="Pool share"
          inputId="stake-share"
          amount={poolShare.prettify(4)}
          unit="%"
        />

        <StaticRow
          label="Redemption gain"
          inputId="stake-gain-eth"
          amount={lqtyStake.collateralGain.prettify(4)}
          color={lqtyStake.collateralGain.nonZero && "success"}
          unit="AR"
        />

        <StaticRow
          label="Issuance gain"
          inputId="stake-gain-lusd"
          amount={lqtyStake.lusdGain.prettify()}
          color={lqtyStake.lusdGain.nonZero && "success"}
          unit={COIN}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button size="lg" variant="outline" onClick={() => dispatch({ type: "startAdjusting" })}>
            <PencilIcon/> Adjust
          </Button>

          <StakingGainsAction />
        </div>
      </CardContent>

      {changePending && <LoadingOverlay />}
    </Card>
  );
};
