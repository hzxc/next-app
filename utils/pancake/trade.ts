import {
  BETTER_TRADE_LESS_HOPS_THRESHOLD,
  ONE_HUNDRED_PERCENT,
  ZERO_PERCENT,
} from 'data/constants';
import { Currency, CurrencyAmount, Pair, Percent, Trade, TradeType } from 'eth';
import { getAllCommonPairs } from './pair';

const MAX_HOPS = 3;

export const tradeExactIn = async (
  currencyAmountIn: CurrencyAmount<Currency>,
  currencyOut: Currency
): Promise<Trade<Currency, Currency, TradeType> | null> => {
  const allowedPairs = await getAllCommonPairs(
    currencyAmountIn.currency,
    currencyOut
  );

  let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null;

  for (let i = 1; i <= MAX_HOPS; i++) {
    const currentTrade: Trade<Currency, Currency, TradeType> | null =
      Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
        maxHops: i,
        maxNumResults: 1,
      })[0] ?? null;
    // if current trade is best yet, save it
    if (
      isTradeBetter(
        bestTradeSoFar,
        currentTrade,
        BETTER_TRADE_LESS_HOPS_THRESHOLD
      )
    ) {
      bestTradeSoFar = currentTrade;
    }
  }

  return bestTradeSoFar;
};

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export async function tradeExactOut(
  currencyIn: Currency,
  currencyAmountOut: CurrencyAmount<Currency>
): Promise<Trade<Currency, Currency, TradeType> | null> {
  const allowedPairs = await getAllCommonPairs(
    currencyIn,
    currencyAmountOut?.currency
  );

  let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null;
  for (let i = 1; i <= MAX_HOPS; i++) {
    const currentTrade =
      Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
        maxHops: i,
        maxNumResults: 1,
      })[0] ?? null;
    if (
      isTradeBetter(
        bestTradeSoFar,
        currentTrade,
        BETTER_TRADE_LESS_HOPS_THRESHOLD
      )
    ) {
      bestTradeSoFar = currentTrade;
    }
  }
  return bestTradeSoFar;
}

function isTradeBetter(
  tradeA: Trade<Currency, Currency, TradeType> | undefined | null,
  tradeB: Trade<Currency, Currency, TradeType> | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT
): boolean | undefined {
  if (tradeA && !tradeB) return false;
  if (tradeB && !tradeA) return true;
  if (!tradeA || !tradeB) return undefined;

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable');
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice);
  }
  return tradeA.executionPrice.asFraction
    .multiply(minimumDelta.add(ONE_HUNDRED_PERCENT))
    .lessThan(tradeB.executionPrice);
}

export const tradeExactInByPairs = async (
  currencyAmountIn: CurrencyAmount<Currency>,
  currencyOut: Currency,
  allowedPairs: Pair[]
): Promise<Trade<Currency, Currency, TradeType> | null> => {
  let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null;

  for (let i = 1; i <= MAX_HOPS; i++) {
    const currentTrade: Trade<Currency, Currency, TradeType> | null =
      Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
        maxHops: i,
        maxNumResults: 1,
      })[0] ?? null;
    // if current trade is best yet, save it
    if (
      isTradeBetter(
        bestTradeSoFar,
        currentTrade,
        BETTER_TRADE_LESS_HOPS_THRESHOLD
      )
    ) {
      bestTradeSoFar = currentTrade;
    }
  }

  return bestTradeSoFar;
};

export async function tradeExactOutByPairs(
  currencyIn: Currency,
  currencyAmountOut: CurrencyAmount<Currency>,
  allowedPairs: Pair[]
): Promise<Trade<Currency, Currency, TradeType> | null> {
  let bestTradeSoFar: Trade<Currency, Currency, TradeType> | null = null;
  for (let i = 1; i <= MAX_HOPS; i++) {
    const currentTrade =
      Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
        maxHops: i,
        maxNumResults: 1,
      })[0] ?? null;
    if (
      isTradeBetter(
        bestTradeSoFar,
        currentTrade,
        BETTER_TRADE_LESS_HOPS_THRESHOLD
      )
    ) {
      bestTradeSoFar = currentTrade;
    }
  }
  return bestTradeSoFar;
}
