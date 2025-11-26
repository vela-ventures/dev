import { GT } from "../../strings";
import { Button } from "../ui/button";

import { InfoMessage } from "../InfoMessage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useStakingView } from "./context/StakingViewContext";

export const NoStake: React.FC = () => {
  const { dispatch } = useStakingView();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Staking</CardTitle>
        <CardDescription>Stake NAU and earn AR</CardDescription>
      </CardHeader>
      <CardContent>
        <InfoMessage title={`You haven't staked ${GT} yet.`}>
          Stake {GT} to earn a share of borrowing and redemption fees.
        </InfoMessage>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => dispatch({ type: "startAdjusting" })}>Start staking</Button>
        </div>
      </CardContent>
    </Card>
  );
};
