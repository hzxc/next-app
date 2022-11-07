import { useMutation, useQuery } from '@tanstack/react-query';
import { baseTokens } from 'data/pancake';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { IToken } from 'redux/pancake/pancakeSlice';
import { http } from 'utils';
import { setTokens } from 'redux/pancake/pancakePersistSlice';
import { selectPancakePersist } from 'redux/pancake/pancakePersistSlice';
import { BigNumber, ethers } from 'ethers';
import { bscProvider } from 'conf';
import { IBEP20ABI } from 'abis/bsc';
import { bscMultiQueryAddr } from 'data/constants';
import { MultiQueryABI } from 'abis';

const getTokens = async () => {
  const array: IToken[] = [];
  const map = new Map<string, number>();
  const extended = await http('/pancake/pancakeswap-extended.json');
  const cmc = await http('/pancake/cmc.json');
  const coingecko = await http('/pancake/coingecko.json');

  baseTokens.forEach((item: IToken) => {
    if (!map.has(item.address)) {
      map.set(item.address, 0);
      // array.push(item);
    }
  });

  extended.tokens?.forEach((item: IToken) => {
    if (!map.has(item.address)) {
      map.set(item.address, 0);
      item.source = 'PancakeSwap Extended';
      array.push(item);
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

  return array;
};

const searchTokens = async (
  param: string,
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

    const mutiQueryContr = new ethers.Contract(
      bscMultiQueryAddr,
      MultiQueryABI,
      bscProvider
    );
    const bep20Iface = new ethers.utils.Interface(IBEP20ABI);
    const funcSymbol = bep20Iface.encodeFunctionData('symbol', []);
    const funcDecimals = bep20Iface.encodeFunctionData('decimals', []);
    const funcName = bep20Iface.encodeFunctionData('name', []);
    const abiCoder = ethers.utils.defaultAbiCoder;

    try {
      const ret = await mutiQueryContr.multiQuery([
        [param, funcSymbol],
        [param, funcDecimals],
        [param, funcName],
      ]);

      const [symbol] = abiCoder.decode(['string'], ret[1][0]);
      const decimals = BigNumber.from(ret[1][1]).toNumber();
      const [name] = abiCoder.decode(['string'], ret[1][2]);

      return [
        {
          name: name,
          symbol: symbol,
          address: param,
          chainId: 56,
          decimals: decimals,
          logoURI: '/images/pancake/panQuestionMark.svg',
          source: 'BscScan',
        },
      ];
    } catch (error) {
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
          chainId: 56,
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
  return useMutation(getTokens, {
    onSuccess: (data) => {
      dispatch(setTokens(data));
    },
  });
};

export const useSearch = (param: string) => {
  const pancake = useAppSelector(selectPancakePersist);

  return useQuery<IToken[], Error>(['searchPancakeTokens', param], () => {
    if (param === '') {
      return pancake.baseTokens;
    } else {
      return searchTokens(param, pancake.tokens || [], pancake.baseTokens);
    }
  });
};
