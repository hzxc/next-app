import { useQuery } from '@tanstack/react-query';
import { PancakeRouterABI } from 'abis/bsc';
import { bscProvider } from 'conf';
import { bscBusdAddr, bscCakeAddr, bscPancakeRouterAddr } from 'data/constants';
import { ethers, utils } from 'ethers';
import { useAppSelector } from 'redux/hooks';
import { selectPancake } from 'redux/pancake/pancakeSlice';

const router = new ethers.Contract(
  bscPancakeRouterAddr,
  PancakeRouterABI,
  bscProvider
);

const getAmounts = async (param: {
  direction: 'in' | 'out';
  amount: string;
  path: string[];
}) => {
  if (param.direction === 'in') {
    return router.getAmountsIn(utils.parseEther(param.amount), [param.path]);
  } else if (param.direction === 'out') {
    return router.getAmountsOut(utils.parseEther(param.amount), [param.path]);
  }
};

export const useGetAmounts = (param: {
  direction: 'in' | 'out';
  amount: string;
  path: string[];
}) => {
  const pancake = useAppSelector(selectPancake);
  return useQuery<any>(['BscGetAmounts', param], () => {
    return getAmounts(param);
  });
};
