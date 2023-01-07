import { BSC_PANCAKE_ROUTER_ADDR } from 'data/constants';
import dayjs from 'dayjs';
import { BigNumber, Contract, ethers, Signer, utils } from 'ethers';
import { useDebounce, useToggle } from 'hooks';
import React, { useState } from 'react';
import { IToken } from 'redux/pancake/pancakeSlice';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from 'wagmi';
import { ConnectWalletModal } from '.';
import { PanButton } from './button';
import IPancakeRouterABI from 'abis/bsc/IPancakeRouter.json';
import { bscProvider } from 'conf';
import path from 'path';

interface SwapProps {
  btnTxt: string;
  swapParam: Param;
}

interface Param {
  from: IToken;
  to: IToken;
  path: string[] | undefined;
  direction: 0 | 1;
  amount: number | string;
}

export const Swap: React.FC<SwapProps> = (props) => {
  const { btnTxt, swapParam } = props;
  const {
    visible: connModalVisible,
    close: connModalClose,
    open: connModalOpen,
  } = useToggle(false);

  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount();

  const confirmSwap = async () => {
    if (!signer || !address || !swapParam.path) return;

    const router = new ethers.Contract(
      BSC_PANCAKE_ROUTER_ADDR,
      IPancakeRouterABI,
      signer
    );

    swapTokens(swapParam, router, address);
  };

  /* #region  Swap */

  const swapTokens = async (
    param: Param,
    routerContract: Contract,
    accountAddress: string
    // slippageTolerance: number,
    // signer: Signer
  ) => {
    const { from, to, path, direction, amount } = param;
    const deadline = BigNumber.from(dayjs().add(30, 'minute').unix());

    if (direction) {
      const amountOut = ethers.utils.parseUnits(
        typeof amount === 'number' ? amount.toString() : amount,
        to.decimals
      );
      const amountIn = await routerContract.callStatic.getAmountsIn(
        amountOut,
        path
      );

      const amountInMax = BigNumber.from(amountIn[0])
        .mul(BigNumber.from(11))
        .div(BigNumber.from(10));

      if (to.address === ethers.constants.AddressZero) {
        // swapTokensForExactETH
        await routerContract.swapTokensForExactETH(
          amountOut,
          amountInMax,
          path,
          accountAddress,
          deadline
        );
      } else if (from.address === ethers.constants.AddressZero) {
        // swapETHForExactTokens
        await routerContract.swapETHForExactTokens(
          amountOut,
          path,
          accountAddress,
          deadline,
          { value: amountInMax }
        );
      } else {
        // swapTokensForExactTokens
        await routerContract.swapTokensForExactTokens(
          amountOut,
          amountInMax,
          path,
          accountAddress,
          deadline
        );
      }
    } else {
      const amountIn = ethers.utils.parseUnits(
        typeof amount === 'number' ? amount.toString() : amount,
        from.decimals
      );
      const amountOut = await routerContract.callStatic.getAmountsOut(
        amountIn,
        path
      );

      const amountOutMin = BigNumber.from(amountOut[1])
        .mul(BigNumber.from(9))
        .div(BigNumber.from(10));

      if (from.address === ethers.constants.AddressZero) {
        // swapExactETHForTokens
        await routerContract.swapExactETHForTokens(
          amountOutMin,
          path,
          accountAddress,
          deadline,
          { value: amountIn }
        );
      } else if (to.address === ethers.constants.AddressZero) {
        // swapExactTokensForETH
        await routerContract.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          accountAddress,
          deadline
        );
      } else {
        // swapExactTokensForTokens
        await routerContract.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          accountAddress,
          deadline
        );
      }
    }
  };

  /* #endregion */

  return (
    <>
      <ConnectWalletModal visible={connModalVisible} close={connModalClose} />
      <PanButton
        className='w-full min-w-[288px] h-12 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:bg-zinc-200'
        disabled={
          btnTxt === 'Enter an amount' || btnTxt.startsWith('Insufficient')
        }
        onClick={() => {
          if (btnTxt === 'Connect Wallet') {
            connModalOpen();
          }

          if (btnTxt === 'Swap') {
            confirmSwap();
          }
        }}
      >
        {btnTxt}
      </PanButton>
    </>
  );
};
