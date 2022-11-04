import { Token } from '../core';
import { validateAndParseAddress } from '../utils';

export interface SerializedToken {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name?: string;
  projectLink?: string;
}

// /**
//  * Represents an ERC20 token with a unique address and some metadata.
//  */

export class ERC20Token extends Token {
  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string,
    logoURI?: string,
    source?: string
  ) {
    super(
      chainId,
      validateAndParseAddress(address),
      decimals,
      symbol,
      name,
      projectLink,
      logoURI,
      source
    );
  }
}
