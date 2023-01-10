import { useQuery } from '@tanstack/react-query';
import { MultiQueryABI } from 'abis';
import { IBEP20ABI } from 'abis/bsc';
import { bscProvider } from 'conf';
import { bscMultiQueryAddr } from 'data/constants';
import { BSC_BNB } from 'data/tokens';
import { ChainId, CurrencyAmount, ERC20Token } from 'eth';
import { BigNumber, ethers } from 'ethers';
import { IToken } from 'redux/pancake/pancakeSlice';
import { isError } from 'utils';
import { getNativeBalance, getTokensBalance } from 'utils/pancake';
import { useAccount } from 'wagmi';
import { usePanChainId } from './usePanChainId';

const getCurrencyBalance = async (act: `0x${string}`, tokens: string[]) => {
  const mutiQueryContr = new ethers.Contract(
    bscMultiQueryAddr,
    MultiQueryABI,
    bscProvider
  );

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
      result.push(bn);
    });

    if (bIndex >= 0) {
      const bnbBal = await getNativeBalance(56, act);
      result.splice(bIndex, 0, bnbBal);
    }
  } catch (err) {
    throw new Error(isError(err) ? err.message : 'unknown error');
  }

  return result;
};

export const useCurrencyBalance = (tokens: IToken[]) => {
  const { address, isConnected } = useAccount();
  console.log('isConnected', isConnected);
  return useQuery<string[], Error>(
    ['PanBalanceOf', address, tokens[0].address, tokens[1].address],
    () => {
      if (isConnected && address) {
        return getBalance(address, tokens);
      } else {
        return [];
      }
    },
    { refetchOnWindowFocus: false, refetchInterval: 15 * 1000 }
  );
};

const getBalance = async (act: `0x${string}`, tokens: IToken[]) => {
  let result: string[] = [];
  let bIndex = -1;
  let queryTokens: ERC20Token[] = [];
  tokens.forEach((item, index) => {
    if (item.address !== ethers.constants.AddressZero) {
      queryTokens.push(
        new ERC20Token(
          item.chainId,
          item.address,
          item.decimals,
          item.symbol,
          item.name,
          item.projectLink,
          item.logoURI,
          item.source
        )
      );
    } else {
      bIndex = index;
    }
  });

  const bals = await getTokensBalance(queryTokens[0].chainId, act, queryTokens);
  bals.forEach((b) => {
    result.push(b.toSignificant());
  });

  if (bIndex >= 0) {
    const bnbBal = await getNativeBalance(queryTokens[0].chainId, act);
    const bnbAmount = CurrencyAmount.fromRawAmount(BSC_BNB, bnbBal._hex);
    result.splice(bIndex, 0, bnbAmount.toSignificant());
  }

  return result;
};
