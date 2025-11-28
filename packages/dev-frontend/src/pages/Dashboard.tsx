import { PriceManager } from "../components/PriceManager";
import { Stability } from "../components/Stability/Stability";
import { Staking } from "../components/Staking/Staking";
import { SystemStats } from "../components/SystemStats";
import { Trove } from "../components/Trove/Trove";

export const Dashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full items-start">
    <div className="mx-4 md:mx-0 md:col-span-3">
      <Trove />
      <Stability />
      <Staking />
      <div className="md:hidden">
        <PriceManager />
      </div>
    </div>

    <div className="hidden md:block md:col-span-2">
      <SystemStats />
      <PriceManager />
    </div>
  </div>
);
