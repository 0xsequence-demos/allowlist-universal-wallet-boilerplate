import { createConfig } from "@0xsequence/kit";

// Get your own keys on sequence.build
const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
const chainId = Number(import.meta.env.VITE_CHAIN_ID);
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PUBLIC_ID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const config: any = createConfig("universal", {
  projectAccessKey: projectAccessKey,
  chainIds: [chainId],
  defaultChainId: chainId,
  appName: "Kit Starter",
  google: true,
  apple: true,
  walletConnect: {
    projectId: walletConnectProjectId,
  },
  metaMask: true,
});
