import { ContractCallContext, Multicall } from 'ethereum-multicall';
import IERC20ABI from 'abis/erc20.json';
import { PROVIDER } from 'conf';
import { CurrencyAmount, ERC20Token } from 'eth';
import { compact } from 'lodash';
import { ethers } from 'ethers';

const balanceCall = async (
  chainId: number,
  act: `0x${string}`,
  tokenAddresses: string[]
) => {
  const contractCallContext: ContractCallContext[] = tokenAddresses.map(
    (addr, i) => {
      return {
        reference: `bal${i}`,
        contractAddress: addr,
        abi: IERC20ABI,
        calls: [
          {
            reference: 'balanceOfCall',
            methodName: 'balanceOf',
            methodParameters: [act],
          },
        ],
      };
    }
  );

  const multicall = new Multicall({
    ethersProvider: PROVIDER[chainId],
    tryAggregate: true,
  });

  const { results } = await multicall.call(contractCallContext);
  return results;
};

export const getNativeBalance = (chainId: number, act: `0x${string}`) => {
  return PROVIDER[chainId].getBalance(ethers.utils.getAddress(act));
};

export const getTokensBalance = async (
  chainId: number,
  act: `0x${string}`,
  tokens: ERC20Token[]
) => {
  const tokenAddresses = tokens.reduce<string[]>((memo, curr) => {
    // if (ethers.constants.AddressZero === curr.address) {
    // }
    memo.push(curr.address);
    return memo;
  }, []);

  const callResults = await balanceCall(chainId, act, tokenAddresses);

  const bals = tokens.map((tkn, i) => {
    const { returnValues: bal, success } =
      callResults[`bal${i}`].callsReturnContext[0];

    if (!success) {
      return null;
    }

    return CurrencyAmount.fromRawAmount(tkn, bal[0].hex);
  });

  return compact(bals);
};
