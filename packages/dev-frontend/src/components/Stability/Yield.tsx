import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import React, { useEffect, useState } from "react";
import { InfoIcon } from "../InfoIcon";
import { Badge } from "../ui/badge";
import { fetchLqtyPrice } from "./context/fetchLqtyPrice";

const selector = ({ lusdInStabilityPool, remainingStabilityPoolLQTYReward }: LiquityStoreState) => ({
  lusdInStabilityPool,
  remainingStabilityPoolLQTYReward
});

const yearlyIssuanceFraction = 0.5;
const dailyIssuanceFraction = Decimal.from(1 - yearlyIssuanceFraction ** (1 / 365));
const dailyIssuancePercentage = dailyIssuanceFraction.mul(100);

export const Yield: React.FC = () => {
  const { lusdInStabilityPool, remainingStabilityPoolLQTYReward } = useLiquitySelector(selector);

  const [lqtyPrice, setLqtyPrice] = useState<Decimal | undefined>(undefined);
  const hasZeroValue = remainingStabilityPoolLQTYReward.isZero || lusdInStabilityPool.isZero;

  useEffect(() => {
    (async () => {
      try {
        const { lqtyPriceUSD } = await fetchLqtyPrice();
        setLqtyPrice(lqtyPriceUSD);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  if (hasZeroValue || lqtyPrice === undefined) return null;

  const lqtyIssuanceOneDay = remainingStabilityPoolLQTYReward.mul(dailyIssuanceFraction);
  const lqtyIssuanceOneDayInUSD = lqtyIssuanceOneDay.mul(lqtyPrice);
  const aprPercentage = lqtyIssuanceOneDayInUSD.mulDiv(365 * 100, lusdInStabilityPool);
  const remainingLqtyInUSD = remainingStabilityPoolLQTYReward.mul(lqtyPrice);

  if (aprPercentage.isZero) return null;

  return (
    <Badge variant="secondary">
      <span>NAU APR {aprPercentage.toString(2)}%</span>
      <InfoIcon
        tooltip={
          <div className="w-[220px] sm:w-[518px]">
            <p>
              An <span className="font-bold">estimate</span> of the NAU return on the GiB
              deposited to the Stability Pool over the next year, not including your AR gains from
              liquidations.
            </p>
            <p className="text-xs font-mono mt-2">
              ($NAU_REWARDS * DAILY_ISSUANCE% / DEPOSITED_GiB) * 365 * 100 ={" "}
              <span className="font-bold"> APR</span>
            </p>
            <p className="text-xs font-mono">
              ($
              {remainingLqtyInUSD.shorten()} * {dailyIssuancePercentage.toString(4)}% / $
              {lusdInStabilityPool.shorten()}) * 365 * 100 =
              <span className="font-bold"> {aprPercentage.toString(2)}%</span>
            </p>
          </div>
        }
      ></InfoIcon>
    </Badge>
  );
};
