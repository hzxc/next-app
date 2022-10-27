import { useQuery } from '@tanstack/react-query';
import { MultiQueryABI } from 'abi';
import { IBEP20ABI } from 'abi/bsc';
import { bscProvider } from 'conf';
import { bscMultiQueryAddr } from 'data';
import { BigNumber, ethers } from 'ethers';
import { isError } from 'utils';
import { useAccount } from 'wagmi';

const mutiQueryContr = new ethers.Contract(
  bscMultiQueryAddr,
  MultiQueryABI,
  bscProvider
);

export const getBnbBalance = (addr: string) => {
  return bscProvider.getBalance(ethers.utils.getAddress(addr));
};

const getBalance = async (act: string, tokens: string[]) => {
  tokens.forEach((item) => {
    if (!ethers.utils.isAddress(item)) {
      throw new Error(`address invalid ${item}`);
    }
  });
  let result: BigNumber[] = [];
  let queryParams: [string, string][] = [];
  let bIndex = -1;
  const bep20Iface = new ethers.utils.Interface(IBEP20ABI);

  tokens.forEach((item, index) => {
    if (item !== ethers.constants.AddressZero) {
      queryParams = [
        ...queryParams,
        [item, bep20Iface.encodeFunctionData('balanceOf', [act])],
      ];
    } else {
      bIndex = index;
    }
  });
  try {
    const ret = await mutiQueryContr.multiQuery([...queryParams]);
    ret[1].forEach((item: string) => {
      const [bn] = ethers.utils.defaultAbiCoder.decode(['uint'], item);
      // console.log('muti query result', ethers.utils.formatUnits(bn, 18));
      result.push(bn);
    });

    if (bIndex >= 0) {
      const bnbBal = await getBnbBalance(act);
      // console.log('bnb balance result', ethers.utils.formatUnits(bnbBal, 18));
      result.splice(bIndex, 0, bnbBal);
    }
  } catch (err) {
    throw new Error(isError(err) ? err.message : 'unknown error');
  }

  console.log(result);

  return result;
};

export const useCurrencyBalance = (tokens: string[]) => {
  const { address, isConnected } = useAccount();
  return useQuery<BigNumber[], Error>(['BalanceOf', tokens], () => {
    if (isConnected && address) {
      return getBalance(address, tokens);
    } else {
      throw new Error('Not connected');
    }
  });
};
