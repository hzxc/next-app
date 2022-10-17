import { useQuery } from '@tanstack/react-query';
import { PancakeRouterABI } from 'abi/bsc';
import { ethers, utils } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(
  'https://bsc-dataseed1.ninicoin.io/',
  {
    name: 'bsc',
    chainId: 56,
  }
);

// const signer = provider.getSigner();
const routerAddr = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const router = new ethers.Contract(routerAddr, PancakeRouterABI, provider);

const getCakeSellPrice = async () => {
  return router.getAmountsOut(utils.parseEther('1'), [
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  ]);
};

export const useCakePrice = () => {
  return useQuery<any>(['CakePrice'], getCakeSellPrice);
};
