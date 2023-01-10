import { Layout, PanButton, Swap, TokenModal } from 'components/pancake';
import ChartSvg from '/public/images/pancake/chart.svg';
import SettingSvg from '/public/images/pancake/setting.svg';
import HistorySvg from '/public/images/pancake/history.svg';
import PanExDown from 'public/images/pancake/panExDown.svg';
import PanExUpDown from 'public/images/pancake/PanExUpDown.svg';
import PanCopy from 'public/images/pancake/panCopy.svg';
import PanQuestionMask from 'public/images/pancake/panQuestionMark.svg';
import { useToggle } from 'hooks';
import { useCurrencyBalance, useTokens } from 'hooks/pancake';
import { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { IconButton } from 'components';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import {
  selectPancake,
  setInputCurrency,
  setOutputCurrency,
} from 'redux/pancake/pancakeSlice';
import { selectPancakePersist } from 'redux/pancake/pancakePersistSlice';
import { IoMdRefresh } from 'react-icons/io';
import { ethers } from 'ethers';
import { ChainId, JSBI, Percent, TradeDirection, _10000, _9975 } from 'eth';
import { useTrade } from 'hooks/pancake/useTrade';

import { getBestUrl } from 'conf';
import { useAccount, useNetwork } from 'wagmi';
import { PAN_COMMON_TOKEN } from 'data/constants';
import { usePanChainId } from 'hooks/pancake/usePanChainId';

const Pancake: NextPageWithLayout = () => {
  const { visible, close, open } = useToggle(false);

  /* #region  wagmi */
  const { address, isConnected } = useAccount();
  const [chainId] = usePanChainId();
  /* #endregion */

  /* #region  redux */
  const pancake = useAppSelector(selectPancake);
  const pancakePersist = useAppSelector(selectPancakePersist);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const [NATIVE, TKN1] = PAN_COMMON_TOKEN[chainId];
    // console.log(NATIVE);
    // console.log(TKN1);
    dispatch(setInputCurrency(NATIVE));
    dispatch(setOutputCurrency(TKN1));
  }, [chainId, dispatch]);
  /* #endregion */

  const { mutate, isIdle } = useTokens();

  const [source, setSource] = useState<'in' | 'out'>('in');
  const [inVal, setInVal] = useState('');
  const [outVal, setOutVal] = useState('');

  const { data: bal } = useCurrencyBalance([
    pancake.inputCurrency,
    pancake.outputCurrency,
  ]);

  const [curBal, setCurBal] = useState({
    inBal: '',
    outBal: '',
  });

  useEffect(() => {
    if (!pancakePersist.tokens[chainId] && isIdle) {
      console.log('get tokens from network');
      mutate();
    } else {
      console.log('get tokens from local storage');
    }
  }, [chainId, isIdle, mutate, pancakePersist.tokens]);

  useEffect(() => {
    if (bal) {
      setCurBal({
        inBal: bal[0],
        outBal: bal[1],
      });
    }
  }, [bal]);

  const [tradeParam, setTradeParam] = useState({
    amountToTrade: '',
    direction: TradeDirection.input,
  });

  const { data: tradeData } = useTrade({
    fromToken: pancake.inputCurrency,
    toToken: pancake.outputCurrency,
    amountToTrade: tradeParam.amountToTrade,
    direction: tradeParam.direction,
  });

  useEffect(() => {
    console.log(tradeData);
    if (tradeData) {
      tradeParam.direction
        ? setInVal(tradeData.inputAmount.toSignificant())
        : setOutVal(tradeData.outputAmount.toSignificant());
    } else {
      if (tradeParam.direction) {
        setInVal('');
      } else if (!tradeParam.direction) {
        setOutVal('');
      }
    }
  }, [tradeData, tradeParam.direction]);

  useEffect(() => {
    getBestUrl();
  }, []);

  const setTradeDirection = () => {
    if (tradeParam.direction) {
      setInVal(outVal);
      setOutVal('');
    } else {
      setOutVal(inVal);
      setInVal('');
    }
    setTradeParam({
      ...tradeParam,
      direction: tradeParam.direction
        ? TradeDirection.input
        : TradeDirection.output,
    });
  };

  const tknEx = () => {
    const tmp = { ...pancake.outputCurrency };
    dispatch(setOutputCurrency({ ...pancake.inputCurrency }));
    dispatch(setInputCurrency(tmp));

    setTradeDirection();
  };

  const [btnTxt, setBtnTxt] = useState('Connect Wallet');

  useEffect(() => {
    if (!isConnected) {
      setBtnTxt('Connect Wallet');
    } else if (!tradeParam.direction && Number(tradeParam.amountToTrade) <= 0) {
      setBtnTxt('Enter an amount');
    } else if (tradeParam.direction && Number(tradeParam.amountToTrade) <= 0) {
      setBtnTxt('Enter an amount');
    } else if (Number(inVal) > Number(curBal.inBal)) {
      setBtnTxt(`Insufficient ${pancake.inputCurrency.symbol} balance`);
    } else {
      setBtnTxt('Swap');
    }
  }, [isConnected, tradeParam, inVal, curBal, pancake.inputCurrency.symbol]);

  return (
    <>
      <div>
        <p>{JSON.stringify(tradeParam)}</p>
        <p>chainId:{chainId}</p>
        <p>isConnected:{JSON.stringify(isConnected)}</p>
        <p>address:{address}</p>
        <p className='break-all'>
          path:
          {JSON.stringify(
            tradeData?.route.path.reduce<string[]>((memo, curr) => {
              memo.push(curr.address);
              return memo;
            }, [])
          )}
        </p>
      </div>
      <div className='w-[328px]'>
        <TokenModal
          visible={visible}
          modalClose={close}
          source={source}
          setTradeDirection={setTradeDirection}
        />
        <div className='flex flex-col border border-[#e7e3eb] rounded-3xl bg-white shadow-sm'>
          <div className='p-6 border-b'>
            <div className='flex items-center justify-between'>
              <IconButton
                leftIcon={<ChartSvg className='w-6 h-6' />}
              ></IconButton>
              <span className='text-xl font-semibold text-[#280d5f] pl-14'>
                Swap
              </span>
              <div className='flex gap-2'>
                <IconButton
                  className='text-[#7a6eaa] hover:opacity-70 active:translate-y-px'
                  leftIcon={<SettingSvg />}
                ></IconButton>
                <IconButton
                  className='text-[#7a6eaa]  hover:opacity-70 active:translate-y-px'
                  leftIcon={<HistorySvg />}
                ></IconButton>
                <IconButton
                  className='text-[#D7CAEC] hover:opacity-70 active:translate-y-px'
                  leftIcon={<IoMdRefresh />}
                ></IconButton>
              </div>
            </div>
            <div className='text-sm text-center'>
              Trade tokens in an instant
            </div>
          </div>
          <div className='flex flex-col items-start justify-start p-4 gap-2 text-indigo-900 font-semibold'>
            <div className='w-full flex items-center justify-between px-2 space-x-2'>
              <div>
                <IconButton
                  onClick={() => {
                    setSource('in');
                    open();
                  }}
                  className='align-middle active:translate-y-px [&>div>span:last-child]:!ml-[-2px]'
                  leftSrc={
                    pancake.inputCurrency.logoURI
                      ? pancake.inputCurrency.logoURI
                      : '/images/pancake/panQuestionMark.svg'
                  }
                  rightSrc='/images/pancake/arrowDown.svg'
                >
                  {pancake.inputCurrency.symbol}
                </IconButton>
                {pancake.inputCurrency.address !==
                ethers.constants.AddressZero ? (
                  <IconButton
                    className='align-middle text-[#7a6eaa] active:translate-y-px hover:opacity-70'
                    leftSize='16px'
                    leftIcon={<PanCopy />}
                  ></IconButton>
                ) : undefined}
              </div>
              <span className='font-normal text-sm text-[#7a6eaa]'>
                {curBal.inBal ? 'Balance:' + curBal.inBal : ''}
              </span>
            </div>
            <input
              placeholder='0.0'
              className='h-14 px-4 w-full pb-4 font-normal bg-[#eeeaf4] ring ring-[#eeeaf4] focus-visible:outline-0 rounded-2xl text-right placeholder:text-[#7a6eaa] '
              type='text'
              value={inVal}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  // if (Number(e.target.value) > 0) {
                  setTradeParam({
                    amountToTrade: e.target.value,
                    direction: TradeDirection.input,
                  });
                  // }

                  setInVal(e.target.value);
                }
              }}
            />

            <div className='p-1 w-full text-center'>
              <IconButton
                exClassName='panEx'
                leftSize='20px'
                rightSize='20px'
                leftIcon={<PanExDown />}
                rightIcon={<PanExUpDown className='text-white' />}
                onClick={tknEx}
              ></IconButton>
            </div>
            <div className='w-full flex items-center justify-between px-2 space-x-2'>
              <div>
                <IconButton
                  onClick={() => {
                    setSource('out');
                    open();
                  }}
                  className='align-middle active:translate-y-px [&>div>span:last-child]:!ml-[-2px]'
                  leftSrc={
                    pancake.outputCurrency.logoURI
                      ? pancake.outputCurrency.logoURI
                      : '/images/pancake/panQuestionMark.svg'
                  }
                  rightSrc='/images/pancake/arrowDown.svg'
                >
                  {pancake.outputCurrency.symbol}
                </IconButton>
                {pancake.outputCurrency.address !==
                ethers.constants.AddressZero ? (
                  <IconButton
                    className='align-middle text-[#7a6eaa] active:translate-y-px hover:opacity-70'
                    leftSize='16px'
                    leftIcon={<PanCopy />}
                  ></IconButton>
                ) : undefined}
              </div>
              <span className='font-normal text-sm text-[#7a6eaa]'>
                {curBal.outBal ? 'Balance:' + curBal.outBal : ''}
              </span>
            </div>

            <input
              placeholder='0.0'
              className='h-14 px-4 w-full pb-4 font-normal bg-[#eeeaf4] ring ring-[#eeeaf4] focus-visible:outline-0 rounded-2xl text-right placeholder:text-[#7a6eaa] '
              type='text'
              value={outVal}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value))) {
                  // if (Number(e.target.value) > 0) {
                  setTradeParam({
                    amountToTrade: e.target.value,
                    direction: TradeDirection.output,
                  });
                  // }

                  setOutVal(e.target.value);
                }
              }}
            />

            <div className='w-full p-1 flex justify-end gap-1'>
              <PanButton className='!py-[2px] !px-2 text-xs'>
                SCAN RISK
              </PanButton>
              <PanQuestionMask className='text-[#7a6eaa] h-5 w-5' />
            </div>
            <div className='w-full text-xs font-medium text-[#7645d9]'>
              {tradeData ? (
                <div className='flex items-center justify-between px-4'>
                  <span>Price</span>
                  <span className='text-[#280d5f] text-base font-normal'>
                    {`${tradeData.executionPrice
                      .invert()
                      .toSignificant()} ${tradeData.executionPrice.baseCurrency.symbol.replace(
                      'WBNB',
                      'BNB'
                    )} per ${tradeData.executionPrice.quoteCurrency.symbol.replace(
                      'WBNB',
                      'BNB'
                    )}`}
                  </span>

                  <IconButton
                    className='bg-gray-100 hover:bg-gray-200 rounded-full p-1 ml-1 align-bottom'
                    rightSize='14px'
                    rightSrc='/images/pancake/refresh.svg'
                  ></IconButton>
                </div>
              ) : undefined}
              <div className='flex items-center justify-between px-4'>
                <span>Slippage Tolerance</span>
                <span className='text-[#1fc7d4] text-base'>0.5%</span>
              </div>
            </div>

            <Swap
              btnTxt={btnTxt}
              swapParam={{
                from: pancake.inputCurrency,
                to: pancake.outputCurrency,
                path: tradeData?.route.path.reduce<string[]>((memo, curr) => {
                  memo.push(curr.address);
                  return memo;
                }, []),
                direction: tradeParam.direction,
                amount: tradeParam.amountToTrade,
              }}
            ></Swap>
          </div>
          {tradeData ? (
            <div className='px-4 pb-4 text-[#7a6eaa] text-sm'>
              <div className='flex items-center justify-between'>
                <IconButton
                  className='cursor-text shrink-0'
                  rightSize='16px'
                  rightIcon={<PanQuestionMask />}
                >
                  {tradeParam.direction ? 'Maximum sold' : 'Minimum received'}
                </IconButton>
                <div className='text-[#280d5f] text-sm'>
                  {tradeParam.direction
                    ? `${tradeData.inputAmount
                        .multiply(new Percent(1005, 1000))
                        .toSignificant(
                          4
                        )} ${tradeData.inputAmount.currency.symbol.replace(
                        'WBNB',
                        'BNB'
                      )}`
                    : `${tradeData.outputAmount
                        .multiply(new Percent(995, 1000))
                        .toSignificant(
                          4
                        )} ${tradeData.outputAmount.currency.symbol.replace(
                        'WBNB',
                        'BNB'
                      )}`}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <IconButton
                  className='cursor-text shrink-0'
                  rightSize='16px'
                  rightIcon={<PanQuestionMask />}
                >
                  Price Impact
                </IconButton>
                <div className='text-[#280d5f] text-sm'>
                  {tradeData.priceImpact
                    .subtract(
                      new Percent(25, 10000).multiply(
                        tradeData.route.pairs.length
                      )
                    )
                    .greaterThan(new Percent(100, 10000)) ? (
                    <span>
                      {tradeData.priceImpact
                        .subtract(
                          new Percent(25, 10000).multiply(
                            tradeData.route.pairs.length
                          )
                        )
                        .toFixed()}
                      %
                    </span>
                  ) : (
                    <span className='text-[#31d0aa]'>
                      {tradeData.priceImpact
                        .subtract(
                          new Percent(25, 10000).multiply(
                            tradeData.route.pairs.length
                          )
                        )
                        .lessThan(new Percent(1, 10000))
                        ? '<0.01%'
                        : tradeData.priceImpact
                            .subtract(
                              new Percent(25, 10000).multiply(
                                tradeData.route.pairs.length
                              )
                            )
                            .toFixed() + '%'}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <IconButton
                  className='cursor-text shrink-0'
                  rightSize='16px'
                  rightIcon={<PanQuestionMask />}
                >
                  Liquidity Provider Fee
                </IconButton>
                <div className='text-[#280d5f] text-sm'>
                  {tradeData.inputAmount
                    .subtract(
                      tradeData.inputAmount
                        .multiply(
                          JSBI.exponentiate(
                            _9975,
                            JSBI.BigInt(tradeData.route.pairs.length)
                          )
                        )
                        .divide(
                          JSBI.exponentiate(
                            _10000,
                            JSBI.BigInt(tradeData.route.pairs.length)
                          )
                        )
                    )
                    .toSignificant(4) + ' '}
                  {tradeData.inputAmount.currency.symbol.replace('WBNB', 'BNB')}
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <IconButton
                  className='cursor-text'
                  rightSize='16px'
                  rightIcon={<PanQuestionMask />}
                >
                  Route
                </IconButton>
                <IconButton
                  rightSrc='/images/pancake/search.svg'
                  rightSize='20px'
                  className='text-[#280d5f] text-sm'
                >
                  {tradeData.route.path.map((tkn, i) => {
                    return (
                      <span key={i}>
                        {i
                          ? ' > ' + tkn.symbol.replace('WBNB', 'BNB')
                          : tkn.symbol.replace('WBNB', 'BNB')}
                      </span>
                    );
                  })}
                </IconButton>
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </>
  );
};

Pancake.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Pancake;
