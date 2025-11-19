import React, { useState } from "react";
import { Close, Heading, NavLink, NavLinkProps } from "theme-ui";
import { ReactModal } from "../../../ReactModal";
import { useBondView } from "../../context/BondViewContext";
import { DepositPane } from "./DepositPane";
import { WithdrawPane } from "./WithdrawPane";
import { StakePane } from "./StakePane";
import { UnstakePane } from "./UnstakePane";
import { RewardsPane } from "./RewardsPane";

interface LinkProps extends NavLinkProps {
  active?: boolean;
}

const Link: React.FC<LinkProps> = ({ active, children, ...props }) => (
  <NavLink {...props} sx={{ cursor: "pointer", ...(active ? { color: "primary" } : {}) }}>
    {children}
  </NavLink>
);

export const ManagingLiquidity: React.FC = () => {
  const { dispatchEvent } = useBondView();
  const [selectedPane, setSelectedPane] = useState<
    "deposit" | "withdraw" | "stake" | "unstake" | "claim"
  >("deposit");

  const handleDismiss = () => {
    dispatchEvent("ABORT_PRESSED");
  };

  return (
    <ReactModal onDismiss={handleDismiss}>
      <Heading as="h2" sx={{ pt: 2, pb: 3, px: 2 }}>
        <div className="flex justify-center">Manage liquidity</div>
        <Close
          onClick={handleDismiss}
          sx={{
            position: "absolute",
            right: "24px",
            top: "24px"
          }}
        />
      </Heading>

      <div className="flex mb-3" as="nav">
        <Link active={selectedPane === "deposit"} onClick={() => setSelectedPane("deposit")}>
          Deposit
        </Link>

        <Link active={selectedPane === "withdraw"} onClick={() => setSelectedPane("withdraw")}>
          Withdraw
        </Link>

        <Link active={selectedPane === "stake"} onClick={() => setSelectedPane("stake")}>
          Stake
        </Link>

        <Link active={selectedPane === "unstake"} onClick={() => setSelectedPane("unstake")}>
          Unstake
        </Link>

        <Link active={selectedPane === "claim"} onClick={() => setSelectedPane("claim")}>
          Rewards
        </Link>
      </div>

      {selectedPane === "deposit" && <DepositPane />}
      {selectedPane === "withdraw" && <WithdrawPane />}
      {selectedPane === "stake" && <StakePane />}
      {selectedPane === "unstake" && <UnstakePane />}
      {selectedPane === "claim" && <RewardsPane />}
    </ReactModal>
  );
};
