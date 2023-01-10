import { BSC_PANCAKE_ROUTER_ADDR, PAN_ROUTER_ADDRESS } from 'data/constants';
import dayjs from 'dayjs';
import { BigNumber, ethers } from 'ethers';
import { useToggle } from 'hooks';
import { IToken } from 'redux/pancake/pancakeSlice';
import { useAccount, useContract, useSigner } from 'wagmi';
import { ConnectWalletModal } from '.';
import { PanButton } from './button';
import IRouterABI from 'abis/pancake/router.json';
import { usePanChainId } from 'hooks/pancake/usePanChainId';

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

  const { data: signer } = useSigner({});
  const { address, isConnected } = useAccount();
  const [chainId] = usePanChainId();
  const contract = useContract({
    address: PAN_ROUTER_ADDRESS[chainId],
    abi: IRouterABI,
    signerOrProvider: signer,
  });

  const confirmSwap = async () => {
    if (!signer || !isConnected || !address || !swapParam.path) return;

    // const router = new ethers.Contract(
    //   BSC_PANCAKE_ROUTER_ADDR,
    //   IPancakeRouterABI,
    //   signer
    // );

    swapTokens(swapParam);
  };

  /* #region  Swap */

  const swapTokens = async (param: Param) => {
    const { from, to, path, direction, amount } = param;
    const deadline = BigNumber.from(dayjs().add(30, 'minute').unix());

    if (direction) {
      const amountOut = ethers.utils.parseUnits(
        typeof amount === 'number' ? amount.toString() : amount,
        to.decimals
      );
      // const amountIn = await routerContract.callStatic.getAmountsIn(
      //   amountOut,
      //   path
      // );

      const amountIn = await contract?.callStatic.getAmountsIn(amountOut, path);

      const amountInMax = BigNumber.from(amountIn[0])
        .mul(BigNumber.from(11))
        .div(BigNumber.from(10));
      try {
        if (to.address === ethers.constants.AddressZero) {
          // swapTokensForExactETH
          await contract?.swapTokensForExactETH(
            amountOut,
            amountInMax,
            path,
            address,
            deadline
          );
        } else if (from.address === ethers.constants.AddressZero) {
          // swapETHForExactTokens
          await contract?.swapETHForExactTokens(
            amountOut,
            path,
            address,
            deadline,
            { value: amountInMax }
          );
        } else {
          // swapTokensForExactTokens
          await contract?.swapTokensForExactTokens(
            amountOut,
            amountInMax,
            path,
            address,
            deadline
          );
        }
      } catch (error: any) {
        console.log('error?.reason', error?.reason);
      }
    } else {
      const amountIn = ethers.utils.parseUnits(
        typeof amount === 'number' ? amount.toString() : amount,
        from.decimals
      );
      const amountOut = await contract?.callStatic.getAmountsOut(
        amountIn,
        path
      );

      const amountOutMin = BigNumber.from(amountOut[1])
        .mul(BigNumber.from(9))
        .div(BigNumber.from(10));

      try {
        if (from.address === ethers.constants.AddressZero) {
          // swapExactETHForTokens
          await contract?.swapExactETHForTokens(
            amountOutMin,
            path,
            address,
            deadline,
            { value: amountIn }
          );
        } else if (to.address === ethers.constants.AddressZero) {
          // swapExactTokensForETH
          await contract?.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            path,
            address,
            deadline
          );
        } else {
          // swapExactTokensForTokens
          await contract?.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address,
            deadline
          );
        }
      } catch (error: any) {
        console.log('error?.reason:', error?.reason);
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
