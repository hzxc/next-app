import { BSC_PANCAKE_ROUTER_ADDR } from 'data/constants';
import { BigNumber } from 'ethers';
import { useDebounce, useToggle } from 'hooks';
import React, { useState } from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { ConnectWalletModal } from '.';
import { PanButton } from './button';

interface SwapProps {
  btnTxt: string;
  //   direction: 0 | 1;
  //   amountToTrade: string;
}

export const Swap: React.FC<SwapProps> = (props) => {
  const { btnTxt, ...restProps } = props;
  const {
    visible: connModalVisible,
    close: connModalClose,
    open: connModalOpen,
  } = useToggle(false);

  /* #region  Swap */

  const [tokenId, setTokenId] = useState('');
  const debouncedTokenId = useDebounce(tokenId);

  const {
    config: swapExactTokensForTokensConfig,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: BSC_PANCAKE_ROUTER_ADDR,
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        name: 'swapExactTokensForTokens',
        outputs: [
          { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'swapExactTokensForTokens',
    // ,swapTokensForExactTokens,swapTokensForExactETH,swapExactTokensForETH,swapETHForExactTokens,swapExactETHForTokens
    // args: [BigNumber.from(1), BigNumber.from(1), [], '0x', BigNumber.from(1)],
    enabled: Boolean(debouncedTokenId),
  });

  const {
    data,
    error,
    isError,
    write: swapExactTokensForTokens,
  } = useContractWrite(swapExactTokensForTokensConfig);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

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
        }}
      >
        {btnTxt}
      </PanButton>
    </>
  );
};
