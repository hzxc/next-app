import { useMutation, useQuery } from '@tanstack/react-query';
import { baseTokens } from 'data/pancake';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { IToken } from 'redux/pancake/pancakeSlice';
import { http, isError } from 'utils';
import { setTokens } from 'redux/pancake/pancakePersistSlice';
import { selectPancakePersist } from 'redux/pancake/pancakePersistSlice';
import { ethers } from 'ethers';
import { bscProvider } from 'conf';
import { IBEP20ABI } from 'abi/bsc';

const getTokens = async () => {
  console.log('getTokens');
  const array: IToken[] = [];
  const map = new Map();
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
  console.log('searchTokens');
  if (param.length >= 40) {
    if (!ethers.utils.isAddress(param)) {
      return [];
    }

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

    const contract = new ethers.Contract(param, IBEP20ABI, bscProvider);
    try {
      const symbol: string = await contract.symbol();
      const decimals = await contract.decimals();

      return [
        {
          name: symbol,
          symbol: symbol,
          address: ethers.utils.getAddress(param),
          chainId: 56,
          decimals: Number(decimals),
          logoURI: '/images/pancake/panQuestionMark.svg',
          source: 'BscScan',
        },
      ];
    } catch (error) {
      throw new Error(
        isError(error) ? error.message : 'get token from bsc error'
      );
    }
  } else if (param.length > 0) {
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

  return baseTokens;
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
  param = param.trim();
  const pancake = useAppSelector(selectPancakePersist);

  return useQuery<IToken[], Error>(['searchPancakeTokens', param], () => {
    return searchTokens(param, pancake.tokens || [], pancake.baseTokens);
  });
};
