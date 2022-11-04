import { useMemo } from 'react';
import IPancakePairABI from 'abis/bsc/IPancakePair.json';

import { wrappedCurrency } from 'utils/wrappedCurrency';
import { Currency, CurrencyAmount } from 'eth/core';
import { Pair } from 'eth/entities/pair';
import { ContractCallContext, Multicall } from 'ethereum-multicall';
import { bscProvider } from 'conf';
import invariant from 'tiny-invariant';
import compact from 'lodash/compact';

const pairCall = async (pairAddresses: string[]) => {
  const contractCallContext: ContractCallContext[] = pairAddresses.map(
    (addr) => {
      return {
        reference: 'pair',
        contractAddress: addr,
        abi: IPancakePairABI,
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
    ethersProvider: bscProvider,
    tryAggregate: true,
  });

  const { results } = await multicall.call(contractCallContext);

  return results['pair'].callsReturnContext;
};

const getPairs = async (
  currencies: [Currency, Currency][]
): Promise<Pair[]> => {
  const chainId = 56;
  const tokens = currencies.map(([currencyA, currencyB]) => [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ]);

  const pairAddresses = tokens.map(([tokenA, tokenB]) => {
    invariant(
      !tokenA.equals(tokenB),
      `usePairs error:pairAddresses: ${tokenA?.address}-${tokenB?.address} chainId: ${tokenA?.chainId}`
    );

    return Pair.getAddress(tokenA, tokenB);
  });

  const callResults = await pairCall(pairAddresses);

  const pairs = callResults.map((result, i) => {
    const { returnValues: reserves, success } = result;

    if (!success) {
      return null;
    }

    const tokenA = tokens[i][0];
    const tokenB = tokens[i][1];

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
  tokenA: Currency,
  tokenB: Currency
): Promise<Pair> => {
  const ret = await getPairs([[tokenA, tokenB]]);
  return ret[0];
};

export async function usePairs(
  currencies: [Currency, Currency][]
): Promise<[Pair][]> {
  const chainId = 56;

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies]
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        invariant(
          !tokenA.equals(tokenB),
          `usePairs error:pairAddresses: ${tokenA?.address}-${tokenB?.address} chainId: ${tokenA?.chainId}`
        );

        return Pair.getAddress(tokenA, tokenB);
      }),
    [tokens]
  );

  const callResults = await pairCall(pairAddresses);

  const contractCallContext: ContractCallContext[] = useMemo(() => {
    return pairAddresses.map((addr) => {
      return {
        reference: 'pair',
        contractAddress: addr,
        abi: IPancakePairABI,
        calls: [
          {
            reference: 'getReservesCall',
            methodName: 'getReserves',
            methodParameters: [],
          },
        ],
      };
    });
  }, [pairAddresses]);

  const multicall = new Multicall({
    ethersProvider: bscProvider,
    tryAggregate: true,
  });

  const results = await pairCall(pairAddresses);

  const pairs: ([Pair] | null)[] = useMemo(() => {
    return results.map((result, i) => {
      const { returnValues: reserves, success } = result;

      if (!success) {
        return null;
      }

      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      const [reserve0, reserve1] = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      return [
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.hex),
          CurrencyAmount.fromRawAmount(token1, reserve1.hex)
        ),
      ];
    });
  }, [results, tokens]);

  return compact(pairs);
}

export async function usePair(
  tokenA: Currency,
  tokenB: Currency
): Promise<[Pair]> {
  const pairCurrencies = useMemo<[Currency, Currency][]>(
    () => [[tokenA, tokenB]],
    [tokenA, tokenB]
  );
  const ret = await usePairs(pairCurrencies);
  return ret[0];
}
