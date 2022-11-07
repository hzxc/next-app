import { useQuery } from '@tanstack/react-query';
import { PancakeRouterABI } from 'abis/bsc';
import { bscProvider } from 'conf';
import { bscBusdAddr, bscCakeAddr, bscPancakeRouterAddr } from 'data/constants';
import { ethers, utils } from 'ethers';

const router = new ethers.Contract(
  bscPancakeRouterAddr,
  PancakeRouterABI,
  bscProvider
);

const getCakeSellPrice = async () => {
  // console.log('getCakePrice');
  return router.getAmountsOut(utils.parseEther('1'), [
    bscCakeAddr,
    // busd addr
    bscBusdAddr,
  ]);
};

export const useCakePrice = () => {
  return useQuery<any, Error>(['CakePrice'], getCakeSellPrice, {
    refetchOnWindowFocus: false,
    refetchInterval: 60 * 1000,
    // retryDelay: 10 * 1000,
  });
};
