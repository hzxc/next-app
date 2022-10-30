import { bscProvider } from 'conf';
import {
  bscPancakeRouterAddr,
  bscPanFactoryAddr,
  bscWBnbAddr,
  Multicall3Addr,
} from 'data/constants';
import {
  ChainId,
  TradeDirection,
  UniswapPair,
  UniswapPairSettings,
  UniswapVersion,
} from 'simple-uniswap-sdk';

export const pancakeBestPath = async (
  fromToken: string,
  toToken: string,
  amountToTrade: string,
  direction: TradeDirection
) => {
  const pair = new UniswapPair({
    // the contract address of the token you want to convert FROM
    fromTokenContractAddress: fromToken,
    // the contract address of the token you want to convert TO
    toTokenContractAddress: toToken,
    // the ethereum address of the user using this part of the dApp
    ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
    // you can pass in the provider url as well if you want
    // providerUrl: YOUR_PROVIDER_URL,
    // OR if you want to inject your own ethereum provider (no need for chainId if so)
    ethereumProvider: bscProvider,
    // chainId: ChainId.MAINNET,
    settings: new UniswapPairSettings({
      // slippage: 0.005, // Slippage config
      deadlineMinutes: 5, // 5m max execution deadline
      disableMultihops: false, // Allow multihops
      uniswapVersions: [UniswapVersion.v2], // Only V2
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: bscPancakeRouterAddr,
          factoryAddress: bscPanFactoryAddr,
          pairAddress: bscPanFactoryAddr,
        },
      },
      customNetwork: {
        nameNetwork: 'Binance',
        multicallContractAddress: Multicall3Addr,
        nativeCurrency: {
          name: 'Binance',
          symbol: 'BNB',
        },
        nativeWrappedTokenInfo: {
          chainId: 56,
          contractAddress: bscWBnbAddr,
          decimals: 18,
          symbol: 'WBNB',
          name: 'Wrapped Binance',
        },
        baseTokens: {
          usdt: {
            chainId: 56,
            contractAddress: '0x55d398326f99059fF775485246999027B3197955',
            decimals: 18,
            symbol: 'USDT',
            name: 'Theter USD',
          },
          comp: {
            chainId: 56,
            contractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
            decimals: 18,
            symbol: 'BUSD',
            name: 'Binance USD',
          },
          usdc: {
            chainId: 56,
            contractAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            decimals: 18,
            symbol: 'USDC',
            name: 'USD Coin',
          },
          dai: {
            chainId: 56,
            contractAddress: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
            decimals: 18,
            symbol: 'DAI',
            name: 'Dai',
          },
          wbtc: {
            chainId: 56,
            contractAddress: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
            decimals: 18,
            symbol: 'WBTC',
            name: 'Wrapped Bitcoin',
          },
        },
      },
    }),
  });

  const pairFactory = await pair.createFactory();

  // the amount is the proper entered amount
  // so if they enter 10 pass in 10
  // it will work it all out for you
  const findBestRoute = await pairFactory.findBestRoute(
    amountToTrade,
    direction
  );
  // console.log(findBestRoute.bestRouteQuote.routeText);
  return findBestRoute;
};
