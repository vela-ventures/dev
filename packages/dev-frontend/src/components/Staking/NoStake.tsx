import { Box, Card } from "theme-ui";
import { GT } from "../../strings";
import { Button } from "../ui/button";

import { InfoMessage } from "../InfoMessage";
import { useStakingView } from "./context/StakingViewContext";

export const NoStake: React.FC = () => {
  const { dispatch } = useStakingView();

  return (
    <Card>
      <h1 className="text-lg font-semibold p-4 pb-0">Staking</h1>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title={`You haven't staked ${GT} yet.`}>
          Stake {GT} to earn a share of borrowing and redemption fees.
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => dispatch({ type: "startAdjusting" })}>Start staking</Button>
        </div>
      </Box>
    </Card>
  );
};
