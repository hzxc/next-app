import { ChainId, Token } from 'packages/pancake/sdk';

export type ChainMap<T> = {
  readonly [chainId in ChainId]: T;
};

export type ChainTokenList = ChainMap<Token[]>;
