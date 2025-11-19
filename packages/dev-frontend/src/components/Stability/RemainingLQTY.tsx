import React from "react";

import { LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";

const selector = ({ remainingStabilityPoolLQTYReward }: LiquityStoreState) => ({
  remainingStabilityPoolLQTYReward
});

export const RemainingLQTY: React.FC = () => {
  const { remainingStabilityPoolLQTYReward } = useLiquitySelector(selector);

  return (
    <div className="flex mr-2" style={{ fontSize: "var(--theme-ui-fontSizes-2)", fontWeight: "medium" }}>
      {remainingStabilityPoolLQTYReward.prettify(0)} NAU remaining
    </div>
  );
};
