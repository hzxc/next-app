import { useMutation, useQuery } from '@tanstack/react-query';
import { tokens56 } from 'data/baseTokens';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { IToken } from 'redux/pancake/pancakeSlice';
import { http } from 'utils';
import { setBaseTokens, setTokens } from 'redux/pancake/pancakePersistSlice';
import { selectPancakePersist } from 'redux/pancake/pancakePersistSlice';
import { ChainId } from 'eth';
import { useNetwork } from 'wagmi';
import { tokens97 } from 'data/baseTokens/97';
import { bscTestnetTokens } from 'data/tokens';
import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from 'ethereum-multicall';
import { PROVIDER } from 'conf';
import TokenABI from 'abis/pancake/token.json';
import { ethers } from 'ethers';
import { usePanChainId } from './usePanChainId';

const getTokens = async (chainId: number) => {
  const baseArray: IToken[] = [];
  const array: IToken[] = [];
  const map = new Map<string, number>();
  if (chainId === ChainId.BSC) {
    const extended = await http(
      'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
    );
    const cmc = await http('https://tokens.pancakeswap.finance/cmc.json');

    const coingecko = await http(
      'https://tokens.pancakeswap.finance/coingecko.json'
    );

    tokens56.forEach((item: IToken) => {
      if (!map.has(item.address)) {
        map.set(item.address, 0);
        baseArray.push(item);
      }
    });

    extended.tokens?.forEach((item: IToken) => {
      if (!map.has(item.address)) {
        map.set(item.address, 0);
        // item.source = 'PancakeSwap Extended';
        baseArray.push(item);
      }
    });

    cmc.tokens?.forEach((item: IToken) => {
      if (!map.has(item.address)) {
        map.set(item.address, 0);
        item.source = 'CoinMarketCap';
        array.push(item);
      }
    });

    coingecko.tokens?.forEach((item: IToken) => {
      if (!map.has(item.address)) {
        map.set(item.address, 0);
        item.source = 'CoinGecko';
        array.push(item);
      }
    });
  } else if (chainId === ChainId.BSC_TESTNET) {
    tokens97.forEach((item: IToken) => {
      if (!map.has(item.address)) {
        map.set(item.address, 0);
        baseArray.push(item);
      }
    });

    array.push(bscTestnetTokens.bake);
    array.push(bscTestnetTokens.hbtc);
    array.push(bscTestnetTokens.syrup);
    array.push(bscTestnetTokens.usdc);
    array.push(bscTestnetTokens.wbtc);
  }

  return { baseArray, array };
};

const searchTokens = async (
  param: string,
  chainId: number,
  tokens: IToken[],
  baseTokens: IToken[]
) => {
  if (param.length >= 40) {
    if (!ethers.utils.isAddress(param)) {
      return [];
    }

    param = ethers.utils.getAddress(param);

    const baseResult = baseTokens.filter(
      (t) => t.address.toLowerCase() === param.toLowerCase()
    );
    if (baseResult.length > 0) {
      return baseResult;
    }
    const extendedResult = tokens.filter(
      (t) => t.address.toLowerCase() === param.toLowerCase()
    );

    if (extendedResult.length > 0) {
      return extendedResult;
    }

    const multicall = new Multicall({
      ethersProvider: PROVIDER[chainId],
      tryAggregate: true,
    });

    const contractCallContext: ContractCallContext[] = [
      {
        reference: 'tokenContract',
        contractAddress: param,
        abi: TokenABI,
        calls: [
          {
            reference: 'symbolCall',
            methodName: 'symbol',
            methodParameters: [],
          },
          {
            reference: 'decimalsCall',
            methodName: 'decimals',
            methodParameters: [],
          },
          {
            reference: 'nameCall',
            methodName: 'name',
            methodParameters: [],
          },
        ],
      },
    ];

    // const mutiQueryContr = new ethers.Contract(
    //   bscMultiQueryAddr,
    //   MultiQueryABI,
    //   bscProvider
    // );

    // const bep20Iface = new ethers.utils.Interface(IBEP20ABI);
    // const funcSymbol = bep20Iface.encodeFunctionData('symbol', []);
    // const funcDecimals = bep20Iface.encodeFunctionData('decimals', []);
    // const funcName = bep20Iface.encodeFunctionData('name', []);
    // const abiCoder = ethers.utils.defaultAbiCoder;

    try {
      const callResults: ContractCallResults = await multicall.call(
        contractCallContext
      );

      const ret = callResults.results.tokenContract.callsReturnContext;
      if (!ret[0].success || !ret[1].success || !ret[2].success) {
        throw new Error('call error');
      }

      const [symbol] = ret[0].returnValues;
      const [decimals] = ret[1].returnValues;
      const [name] = ret[2].returnValues;

      // const ret = await mutiQueryContr.multiQuery([
      //   [param, funcSymbol],
      //   [param, funcDecimals],
      //   [param, funcName],
      // ]);

      // const [symbol] = abiCoder.decode(['string'], ret[1][0]);
      // const decimals = BigNumber.from(ret[1][1]).toNumber();
      // const [name] = abiCoder.decode(['string'], ret[1][2]);

      // name?: string;
      // symbol: string;
      // address: string;
      // chainId: number;
      // decimals: number;
      // projectLink?: string;
      // logoURI?: string;
      // source?: string;

      return [
        {
          name: name,
          symbol: symbol,
          address: param,
          chainId: chainId,
          decimals: decimals,
          logoURI: '/images/pancake/panQuestionMark.svg',
          source: 'BscScan',
        },
      ];
    } catch {
      // throw new Error(
      //   isError(error) ? error.message : 'get token from bsc error'
      // );
      return [];
    }
  } else {
    const baseResult = baseTokens.filter((t) =>
      t.symbol.toLowerCase().includes(param.toLowerCase())
    );
    const extendedResult = tokens.filter((t) =>
      t.symbol.toLowerCase().includes(param.toLowerCase())
    );

    if (extendedResult.length > 0) {
      return [
        ...baseResult,
        {
          name: 'Expanded results from inactive Token Lists',
          symbol: '',
          address: '',
          chainId: chainId,
          decimals: 18,
        },
        ...extendedResult,
      ];
    } else {
      return baseResult;
    }
  }
};

export const useTokens = () => {
  const dispatch = useAppDispatch();
  const [chainId] = usePanChainId();

  return useMutation(
    () => {
      return getTokens(chainId);
    },
    {
      onSuccess: (data) => {
        const { baseArray, array } = data;
        if (array.length > 0) {
          dispatch(setTokens({ chainId: chainId, tkns: array }));
        }
        if (baseArray.length > 0) {
          dispatch(
            setBaseTokens({
              chainId: chainId,
              tkns: baseArray,
            })
          );
        }
      },
    }
  );
};

export const useSearch = (param: string) => {
  const pancake = useAppSelector(selectPancakePersist);
  const [chainId] = usePanChainId();
  return useQuery<IToken[], Error>(
    ['searchPancakeTokens', param, chainId],
    () => {
      if (param === '') {
        return pancake.baseTokens[chainId] || [];
      } else {
        return searchTokens(
          param,
          chainId,
          pancake.tokens[chainId] || [],
          pancake.baseTokens[chainId]
        );
      }
    }
  );
};
