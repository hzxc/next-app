import { useQuery } from '@tanstack/react-query';
import { PancakeRouterABI } from 'abi/bsc';
import { bscProvider } from 'conf';
import { bscBusdAddr, bscCakeAddr, bscPancakeRouterAddr } from 'data';
import { ethers, utils } from 'ethers';

const router = new ethers.Contract(
  bscPancakeRouterAddr,
  PancakeRouterABI,
  bscProvider
);

const getCakeSellPrice = async () => {
  return router.getAmountsOut(utils.parseEther('1'), [
    bscCakeAddr,
    // busd addr
    bscBusdAddr,
  ]);
};

export const useCakePrice = () => {
  console.log('CakePrice');
  return useQuery<any>(['CakePrice'], getCakeSellPrice);
};
