import { Layout, PanButton, TokenModal } from 'components/pancake';
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
import { JSBI, Percent, TradeDirection, _10000, _9975 } from 'eth';
import { useTrade } from 'hooks/pancake/useTrade';
import { useDebounce } from 'use-debounce';

import _Big from 'big.js';
import toFormat from 'toformat';

const Big = toFormat(_Big);

const Pancake: NextPageWithLayout = () => {
  const { visible, close, open } = useToggle(false);
  const { mutate, isIdle } = useTokens();
  const pancake = useAppSelector(selectPancake);
  const pancakePersist = useAppSelector(selectPancakePersist);
  const dispatch = useAppDispatch();
  const [source, setSource] = useState<'in' | 'out'>('in');
  const [inVal, setInVal] = useState('');
  const [outVal, setOutVal] = useState('');

  const { data: bal } = useCurrencyBalance([
    pancake.inputCurrency.address,
    pancake.outputCurrency.address,
  ]);

  const [curBal, setCurBal] = useState({
    inBal: '',
    outBal: '',
  });

  useEffect(() => {
    if (!pancakePersist.tokens && isIdle) {
      console.log('get tokens from network');
      mutate();
    } else {
      console.log('get tokens from local storage');
    }
  }, [isIdle, mutate]);

  useEffect(() => {
    if (bal && bal.length > 1) {
      const inNum = bal[0].isZero()
        ? '0'
        : ethers.utils.formatUnits(bal[0], pancake.inputCurrency.decimals);
      const outNum = bal[1].isZero()
        ? '0'
        : ethers.utils.formatUnits(bal[1], pancake.outputCurrency.decimals);
      setCurBal({
        inBal: inNum.substring(0, inNum.indexOf('.') + 6),
        outBal: outNum.substring(0, outNum.indexOf('.') + 6),
      });
    }
  }, [bal]);

  const [tradeParam, setTradeParam] = useState({
    amountToTrade: '',
    direction: TradeDirection.input,
  });
  // const [amountToTradeDebounce] = useDebounce(tradeParam.amountToTrade, 400);
  // const [directionDebounce] = useDebounce(tradeParam.direction, 400);

  const { data: tradeData } = useTrade({
    fromToken: pancake.inputCurrency,
    toToken: pancake.outputCurrency,
    amountToTrade: tradeParam.amountToTrade,
    direction: tradeParam.direction,
  });

  useEffect(() => {
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
  }, [tradeData]);

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

  return (
    <div>
      {/* <div>{tradeData ? tradeData?.route.path.length : 'undefined'}</div>
      <div>{amountToTradeDebounce}</div>
      <div>{directionDebounce}</div> */}
      {/* <div>{pancake.inputCurrency.address}</div> */}
      {/* <div>{pancake.outputCurrency.address}</div> */}
      {JSON.stringify(tradeParam)}
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
          <div className='text-sm text-center'>Trade tokens in an instant</div>
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
                setTradeParam({
                  amountToTrade: e.target.value,
                  direction: TradeDirection.input,
                });
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
                setTradeParam({
                  amountToTrade: e.target.value,
                  direction: TradeDirection.output,
                });
                setOutVal(e.target.value);
              }
            }}
          />

          <div className='w-full p-1 flex justify-end gap-1'>
            <PanButton className='!py-[2px] !px-2 text-xs'>SCAN RISK</PanButton>
            <PanQuestionMask className='text-[#7a6eaa] h-5 w-5' />
          </div>
          <div className='w-full text-xs font-medium text-[#7645d9]'>
            {tradeData ? (
              <div className='flex items-center justify-between px-4 gap-3'>
                <span>Price</span>
                <div>
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
              </div>
            ) : undefined}
            <div className='flex items-center justify-between px-4'>
              <span>Slippage Tolerance</span>
              <span className='text-[#1fc7d4] text-base'>0.5%</span>
            </div>
          </div>

          <PanButton className='w-72 h-12'>Connect Wallet</PanButton>
        </div>
        {tradeData ? (
          <div className='px-4 pb-4 text-[#7a6eaa] text-sm'>
            <div className='flex items-center justify-between gap-3'>
              <IconButton
                className='cursor-text'
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
                className='cursor-text'
                rightSize='16px'
                rightIcon={<PanQuestionMask />}
              >
                Price Impact
              </IconButton>
              <div className='text-[#280d5f] text-sm'>
                {tradeData.priceImpact.greaterThan(
                  new Percent(25, 10000)
                    .multiply(tradeData.route.pairs.length)
                    .add(new Percent(1, 10000))
                ) ? (
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
                  <span className='text-[#31d0aa]'>{'<0.01'}%</span>
                )}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <IconButton
                className='cursor-text'
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
            {tradeData.route.pairs.length > 1 ? (
              <div className='flex items-center justify-between'>
                <IconButton
                  className='cursor-text'
                  rightSize='16px'
                  rightIcon={<PanQuestionMask />}
                >
                  Route
                </IconButton>
                <div className='text-[#280d5f] text-sm'>
                  {tradeData.route.path.map((tkn, i) => {
                    return (
                      <span key={i}>
                        {i
                          ? ' > ' + tkn.symbol.replace('WBNB', 'BNB')
                          : tkn.symbol.replace('WBNB', 'BNB')}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : undefined}
          </div>
        ) : undefined}
      </div>
    </div>
  );
};

Pancake.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Pancake;
