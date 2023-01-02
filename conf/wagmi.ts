import { chain, Chain, configureChains, createClient } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

export const bscChain: Chain = {
  id: 56,
  name: 'Binance Smart Chain Mainnet',
  network: '56',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    public: 'https://bsc-dataseed1.binance.org/',
    ninicoin: 'https://bsc-dataseed1.ninicoin.io/',
    defibit: 'https://bsc-dataseed1.defibit.io/',
    default: 'https://bsc-dataseed1.ninicoin.io/',
  },
  blockExplorers: {
    default: { name: 'bscscan', url: 'https://bscscan.com/' },
  },
  testnet: false,
};

const bscTestChain: Chain = {
  id: 97,
  name: 'Binance Smart Chain Testnet',
  network: '97',
  nativeCurrency: {
    name: 'TBNB',
    symbol: 'TBNB',
    decimals: 18,
  },
  rpcUrls: {
    public: 'https://data-seed-prebsc-2-s3.binance.org:8545',
    default: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  },
  blockExplorers: {
    default: { name: 'bscscan testnet', url: 'https://testnet.bscscan.com/' },
  },
  testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, bscChain, bscTestChain],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === bscChain.id) return { http: bscChain.rpcUrls.default };
        if (chain.id === bscTestChain.id)
          return { http: bscTestChain.rpcUrls.default };
        return null;
      },
    }),
  ]
);

// Set up client
const wagmiClient = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export { wagmiClient };
