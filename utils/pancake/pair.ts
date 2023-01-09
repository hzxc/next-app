import { ContractCallContext, Multicall } from 'ethereum-multicall';
import PairABI from 'abis/pancake/pair.json';
import { ChainId, Currency, CurrencyAmount, Pair, Token } from 'eth';
import { wrappedCurrency } from 'utils/wrappedCurrency';
import invariant from 'tiny-invariant';
import { compact, flatMap } from 'lodash';
import {
  ADDITIONAL_BASES,
  PAN_BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
} from 'data/constants';
import { bscProvider, PROVIDER } from 'conf';

const CHAIN_ID = 56;

const pairCall = async (chainId: number, pairAddresses: string[]) => {
  const contractCallContext: ContractCallContext[] = pairAddresses.map(
    (addr, i) => {
      return {
        reference: `pair${i}`,
        contractAddress: addr,
        abi: PairABI,
        calls: [
          {
            reference: 'getReservesCall',
            methodName: 'getReserves',
            methodParameters: [],
          },
        ],
      };
    }
  );

  const multicall = new Multicall({
    ethersProvider: PROVIDER[chainId],
    tryAggregate: true,
  });

  const { results } = await multicall.call(contractCallContext);
  return results;
};

export const getPairs = async (
  chainId: number,
  currencies: [Currency, Currency][]
): Promise<Pair[]> => {
  let tokens: [Token, Token][] = currencies.map(([currencyA, currencyB]) => [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ]);

  // const map = new Map<string, [Token, Token]>();

  const pairAddressesMap = tokens.reduce<{
    [pairAddress: string]: [Token, Token];
  }>((memo, curr) => {
    const [A, B] = curr;
    invariant(
      !A.equals(B),
      `usePairs error:pairAddresses: ${A?.address}-${B?.address} chainId: ${A?.chainId}`
    );
    memo[Pair.getAddress(curr[0], curr[1])] = curr;
    return memo;
  }, {});

  tokens = Object.values(pairAddressesMap);
  const pairAddresses = Object.keys(pairAddressesMap);

  const callResults = await pairCall(chainId, pairAddresses);

  const pairs = tokens.map((tkn, i) => {
    const { returnValues: reserves, success } =
      callResults[`pair${i}`].callsReturnContext[0];

    if (!success) {
      return null;
    }

    const tokenA: any = tkn[0];
    const tokenB: any = tkn[1];

    const [reserve0, reserve1] = reserves;
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

    return new Pair(
      CurrencyAmount.fromRawAmount(token0, reserve0.hex),
      CurrencyAmount.fromRawAmount(token1, reserve1.hex)
    );
  });
  return compact(pairs);
};

export const getPair = async (
  chainId: number,
  tokenA: Currency,
  tokenB: Currency
): Promise<Pair> => {
  const ret = await getPairs(chainId, [[tokenA, tokenB]]);
  return ret[0];
};

export const getAllCommonPairs = async (
  chainId: number,
  currencyA: Currency,
  currencyB: Currency
): Promise<Pair[]> => {
  const [tokenA, tokenB] = [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ];

  const common = PAN_BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];

  // Additional bases for specific tokens
  const additionalA = tokenA
    ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? []
    : [];

  const additionalB = tokenB
    ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? []
    : [];

  const bases = [...common, ...additionalA, ...additionalB];
  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map((otherBase) => [base, otherBase])
  );

  const allPairCombinations = [
    [tokenA, tokenB],
    ...bases.map((base): [Token, Token] => [tokenA, base]),
    ...bases.map((base): [Token, Token] => [tokenB, base]),
    ...basePairs,
  ]
    .filter((tokens): tokens is [Token, Token] =>
      Boolean(tokens[0] && tokens[1])
    )
    .filter(([t0, t1]) => t0.address !== t1.address)
    .filter(([tokenA_, tokenB_]) => {
      const customBases = CUSTOM_BASES[chainId];

      const customBasesA: Token[] | undefined = customBases?.[tokenA_.address];
      const customBasesB: Token[] | undefined = customBases?.[tokenB_.address];

      if (!customBasesA && !customBasesB) return true;

      if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base)))
        return false;
      if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base)))
        return false;

      return true;
    });

  const allPairs = await getPairs(chainId, allPairCombinations);

  return allPairs;
};
