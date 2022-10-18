import { ethers } from 'ethers';

export const hecoUrls: string[] = ['https://http-mainnet.hecochain.com'];

export const hecoProvider = new ethers.providers.JsonRpcProvider(hecoUrls[0], {
  name: 'heco',
  chainId: 128,
});
