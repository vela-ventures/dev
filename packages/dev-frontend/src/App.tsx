import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig, getDefaultConnectors } from "connectkit";
import React from "react";
import { Flex, Heading, Link, Paragraph, ThemeUIProvider } from "theme-ui";
import { defineChain } from "viem";
import { WagmiProvider, createConfig, fallback, http } from "wagmi";
import { goerli, localhost, mainnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

import { Icon } from "./components/Icon";
import { TransactionProvider } from "./components/Transaction";
import { WalletConnector } from "./components/WalletConnector";
import { getConfig } from "./config";
import { LiquityProvider } from "./hooks/LiquityContext";
import theme from "./theme";

import { LiquityFrontend } from "./LiquityFrontend";
import { AppLoader } from "./components/AppLoader";
import { useAsyncValue } from "./hooks/AsyncValue";
import { DisposableWalletProvider } from "./testUtils/DisposableWalletProvider";

const isDemoMode = import.meta.env.VITE_APP_DEMO_MODE === "true";

const load = defineChain({
  id: 9496,
  name: "Load Network",
  nativeCurrency: {
    name: "Load",
    symbol: "LOAD",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://alphanet.load.network"]
    }
  },
  blockExplorers: {
    default: {
      name: "Load Network Explorer",
      url: "https://explorer.load.network"
    }
  }
});

if (isDemoMode) {
  const ethereum = new DisposableWalletProvider(
    import.meta.env.VITE_APP_RPC_URL || `http://${window.location.hostname || "localhost"}:8545`,
    "0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7"
  );

  Object.assign(window, { ethereum });
}

// Start pre-fetching the config
getConfig().then(config => {
  // console.log("Frontend config:");
  // console.log(config);
  Object.assign(window, { config });
});

const UnsupportedMainnetFallback: React.FC = () => (
  <Flex
    sx={{
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center"
    }}
  >
    <Heading sx={{ mb: 3 }}>
      <Icon name="exclamation-triangle" /> This app is for testing purposes only.
    </Heading>

    <Paragraph sx={{ mb: 3 }}>Please change your network to Görli or Sepolia.</Paragraph>

    <Paragraph>
      If you'd like to use the Liquity Protocol on mainnet, please pick a frontend{" "}
      <Link href="https://www.liquity.org/frontend">
        here <Icon name="external-link-alt" size="xs" />
      </Link>
      .
    </Paragraph>
  </Flex>
);

const UnsupportedNetworkFallback: React.FC = () => (
  <Flex
    sx={{
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center"
    }}
  >
    <Heading sx={{ mb: 3 }}>
      <Icon name="exclamation-triangle" /> Liquity is not supported on this network.
    </Heading>
    Please switch to mainnet, Görli or Sepolia.
  </Flex>
);

const queryClient = new QueryClient();

const appName = "Liquity";
const appDescription = "Decentralized borrowing protocol";

const App = () => {
  const config = useAsyncValue(getConfig);
  const loader = <AppLoader />;

  return (
    <ThemeUIProvider theme={theme}>
      {config.loaded && (
        <WagmiProvider
          config={createConfig(
            getDefaultConfig({
              appName,
              appDescription,
              walletConnectProjectId: config.value.walletConnectProjectId,

              chains: [load],
              // isDemoMode || import.meta.env.MODE === "test"
              //   ? [localhost]
              //   : config.value.testnetOnly
              //   ? [goerli, sepolia, load]
              //   : [mainnet, goerli, sepolia, load],

              connectors:
                isDemoMode || import.meta.env.MODE === "test"
                  ? [injected()]
                  : getDefaultConnectors({
                      app: {
                        name: appName,
                        description: appDescription
                      },
                      walletConnectProjectId: config.value.walletConnectProjectId
                    }),

              transports: {
                [mainnet.id]: fallback([
                  ...(config.value.infuraApiKey
                    ? [http(`https://mainnet.infura.io/v3/${config.value.infuraApiKey}`)]
                    : []),
                  ...(config.value.alchemyApiKey
                    ? [http(`https://eth-mainnet.g.alchemy.com/v2/${config.value.alchemyApiKey}`)]
                    : []),
                  http()
                ]),

                [goerli.id]: fallback([
                  ...(config.value.infuraApiKey
                    ? [http(`https://goerli.infura.io/v3/${config.value.infuraApiKey}`)]
                    : []),
                  ...(config.value.alchemyApiKey
                    ? [http(`https://eth-goerli.g.alchemy.com/v2/${config.value.alchemyApiKey}`)]
                    : []),
                  http()
                ]),

                [sepolia.id]: fallback([
                  ...(config.value.infuraApiKey
                    ? [http(`https://sepolia.infura.io/v3/${config.value.infuraApiKey}`)]
                    : []),
                  ...(config.value.alchemyApiKey
                    ? [http(`https://eth-sepolia.g.alchemy.com/v2/${config.value.alchemyApiKey}`)]
                    : []),
                  http()
                ]),

                [localhost.id]: http(),
                [load.id]: http("https://alphanet.load.network")
              }
            })
          )}
        >
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider options={{ hideBalance: true }}>
              <WalletConnector loader={loader}>
                <LiquityProvider
                  loader={loader}
                  unsupportedNetworkFallback={<UnsupportedNetworkFallback />}
                  unsupportedMainnetFallback={<UnsupportedMainnetFallback />}
                >
                  <TransactionProvider>
                    <LiquityFrontend loader={loader} />
                  </TransactionProvider>
                </LiquityProvider>
              </WalletConnector>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </ThemeUIProvider>
  );
};

export default App;
