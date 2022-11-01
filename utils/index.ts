import { ethers } from 'ethers';
import invariant from 'tiny-invariant';

export * from './http';

export const isError = (value: any): value is Error => value?.message;

export const toNumber = (value: unknown) =>
  isNaN(Number(value)) ? 0 : Number(value);

export const sortTokens = (tokenA: string, tokenB: string) => {
  const addrA = ethers.utils.getAddress(tokenA);
  const addrB = ethers.utils.getAddress(tokenB);
  invariant(addrA === addrB, 'IDENTICAL_ADDRESSES');
};
