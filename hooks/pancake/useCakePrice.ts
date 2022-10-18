import { useQuery } from '@tanstack/react-query';
import { PancakeRouterABI } from 'abi/bsc';
import { bscProvider } from 'conf';
import { ethers, utils } from 'ethers';

const panRouterAddr = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const router = new ethers.Contract(
  panRouterAddr,
  PancakeRouterABI,
  bscProvider
);

const getCakeSellPrice = async () => {
  return router.getAmountsOut(utils.parseEther('1'), [
    // cake addr
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    // busd addr
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  ]);
};

export const useCakePrice = () => {
  return useQuery<any>(['CakePrice'], getCakeSellPrice);
};
