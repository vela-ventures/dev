import { Wallet } from "@ethersproject/wallet";
import React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";

import { Decimal, Difference, Trove } from "@liquity/lib-base";
import { LiquityStoreProvider } from "@liquity/lib-react";

import { Header } from "./components/Header";
import { SystemStatsPopup } from "./components/SystemStatsPopup";
import { TransactionMonitor } from "./components/Transaction";
import { UserAccount } from "./components/UserAccount";
import { useLiquity } from "./hooks/LiquityContext";

import { Faucet } from "./pages/Faucet";
import { PageSwitcher } from "./pages/PageSwitcher";
import { RiskyTrovesPage } from "./pages/RiskyTrovesPage";

import "tippy.js/dist/tippy.css"; // Tooltip default style
import { DarkModeButton } from "./components/DarkModeButton";
import { StabilityViewProvider } from "./components/Stability/context/StabilityViewProvider";
import { StakingViewProvider } from "./components/Staking/context/StakingViewProvider";
import { TroveViewProvider } from "./components/Trove/context/TroveViewProvider";

type LiquityFrontendProps = {
  loader?: React.ReactNode;
};

export const LiquityFrontend: React.FC<LiquityFrontendProps> = ({ loader }) => {
  const { account, provider, liquity } = useLiquity();

  // For console tinkering ;-)
  Object.assign(window, {
    account,
    provider,
    liquity,
    Trove,
    Decimal,
    Difference,
    Wallet
  });

  return (
    <LiquityStoreProvider {...{ loader }} store={liquity.store}>
      <Router>
        <TroveViewProvider>
          <StabilityViewProvider>
            <StakingViewProvider>
              <div className="flex flex-col min-h-full">
                <Header>
                  <UserAccount />
                  <SystemStatsPopup />
                  <DarkModeButton />
                </Header>

                <div className="flex flex-col flex-grow items-center mt-20 w-full max-w-[1280px] mx-auto mb-10 px-0 md:px-4 lg:px-8">
                  <Switch>
                    <Route path="/" exact>
                      <PageSwitcher />
                    </Route>
                    <Route path="/risky-troves">
                      <RiskyTrovesPage />
                    </Route>
                    <Route path="/faucet">
                      <Faucet />
                    </Route>
                  </Switch>
                </div>
              </div>
            </StakingViewProvider>
          </StabilityViewProvider>
        </TroveViewProvider>
      </Router>
      <TransactionMonitor />
    </LiquityStoreProvider>
  );
};
