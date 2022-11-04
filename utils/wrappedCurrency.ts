import { ChainId, Currency, CurrencyAmount, Native, Token, WNATIVE } from 'eth';

export function wrappedCurrency(currency: Currency, chainId: ChainId): Token {
  return currency.isNative ? WNATIVE[chainId] : currency;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined
): CurrencyAmount<Token> | undefined {
  const token =
    currencyAmount && chainId
      ? wrappedCurrency(currencyAmount.currency, chainId)
      : undefined;
  return token && currencyAmount
    ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient)
    : undefined;
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WNATIVE[token.chainId]))
    return Native.onChain(token.chainId);
  return token;
}
