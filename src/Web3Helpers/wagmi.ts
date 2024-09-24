import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_PUBLIC_ALCHEMY_ID}`
    ),
    [sepolia.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_PUBLIC_ALCHEMY_ID}`
    ),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
