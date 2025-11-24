import { Box, Card } from "theme-ui";
import { Button } from "../ui/button";

import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

import { COIN, GT } from "../../strings";

import { LoadingOverlay } from "../LoadingOverlay";
import { DisabledEditableRow, StaticRow } from "../Trove/Editor";

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
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0">Staking</h1>

      <Box sx={{ p: [2, 3] }}>
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
      </Box>

      {changePending && <LoadingOverlay />}
    </Card>
  );
};
