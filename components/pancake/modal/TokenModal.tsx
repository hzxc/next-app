import { PanButton } from '../button';
import { FixedSizeList as List } from 'react-window';
import { CSSProperties, useState } from 'react';
import { IconButton } from 'components';
import CloseSvg from 'public/images/pancake/close.svg';
import { useDebounce } from 'use-debounce';
import { useSearch } from 'hooks/pancake';
import { PanModal } from './PanModal';
import PanQuestionMarkSvg from 'public/images/pancake/panQuestionMark.svg';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  IToken,
  selectPancake,
  setInputCurrency,
  setOutputCurrency,
} from 'redux/pancake/pancakeSlice';

import { importToken } from 'redux/pancake/pancakePersistSlice';
import { PAN_COMMON_TOKEN } from 'data/constants';
import { usePanChainId } from 'hooks/pancake/usePanChainId';

export const TokenModal: React.FC<{
  visible: boolean;
  modalClose: () => void;
  source?: 'in' | 'out';
  setTradeDirection?: () => void;
}> = ({ visible, modalClose, source, setTradeDirection }) => {
  const [chainId] = usePanChainId();

  const [NATIVE, TKN1, TKN2, TKN3] = PAN_COMMON_TOKEN[chainId];

  const pancake = useAppSelector(selectPancake);
  const dispatch = useAppDispatch();
  const [searchParam, setSearchParam] = useState('');
  const [debouncedSearchParam] = useDebounce(searchParam, 400);
  const { data: tokens } = useSearch(debouncedSearchParam);
  const close = () => {
    if (visible) {
      modalClose();
      setSearchParam('');
    }
  };

  const tknClick = (tkn: IToken) => {
    if (source === 'in' && tkn.address !== pancake.inputCurrency.address) {
      if (tkn.address === pancake.outputCurrency.address) {
        const tmp = { ...pancake.inputCurrency };
        dispatch(setInputCurrency(tkn));
        dispatch(setOutputCurrency(tmp));
        setTradeDirection?.();
        close();
      } else {
        dispatch(setInputCurrency(tkn));
        close();
      }
    } else if (
      source === 'out' &&
      tkn.address !== pancake.outputCurrency.address
    ) {
      if (tkn.address === pancake.inputCurrency.address) {
        const tmp = { ...pancake.outputCurrency };
        dispatch(setOutputCurrency(tkn));
        dispatch(setInputCurrency(tmp));
        setTradeDirection?.();
        close();
      } else {
        dispatch(setOutputCurrency(tkn));
        close();
      }
    }
  };

  const tknClass = (tkn: IToken) => {
    return `${
      (tkn.address === pancake.inputCurrency.address && source === 'in') ||
      (tkn.address === pancake.outputCurrency.address && source === 'out')
        ? 'opacity-40 !cursor-default hover:bg-white'
        : ''
    }`;
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties | undefined;
  }) => {
    if (tokens) {
      return tokens[index].symbol ? (
        <div
          onClick={
            tokens[index].source
              ? undefined
              : () => {
                  if (
                    source === 'in' &&
                    tokens[index].address !== pancake.inputCurrency.address
                  ) {
                    if (
                      tokens[index].address === pancake.outputCurrency.address
                    ) {
                      const tmp = { ...pancake.inputCurrency };
                      dispatch(setInputCurrency(tokens[index]));
                      dispatch(setOutputCurrency(tmp));
                      setTradeDirection?.();
                      close();
                    } else {
                      dispatch(setInputCurrency(tokens[index]));
                      close();
                    }
                  } else if (
                    source === 'out' &&
                    tokens[index].address !== pancake.outputCurrency.address
                  ) {
                    if (
                      tokens[index].address === pancake.inputCurrency.address
                    ) {
                      const tmp = { ...pancake.outputCurrency };
                      dispatch(setOutputCurrency(tokens[index]));
                      dispatch(setInputCurrency(tmp));
                      setTradeDirection?.();
                      close();
                    } else {
                      dispatch(setOutputCurrency(tokens[index]));
                      close();
                    }
                  }
                }
          }
          className={`flex items-center justify-between ${
            tokens[index].source
              ? 'cursor-default'
              : 'cursor-pointer hover:bg-[#faf9fa]'
          } ${
            tokens[index].address === pancake.inputCurrency.address ||
            tokens[index].address === pancake.outputCurrency.address
              ? 'opacity-40 !cursor-default hover:bg-white'
              : ''
          } px-5 py-1 gap-2`}
          style={style}
        >
          <IconButton leftSrc={tokens[index]?.logoURI}></IconButton>
          <div
            className={`flex-col grow overflow-hidden ${
              tokens[index].source ? 'opacity-40' : ''
            }`}
          >
            <p className='w-52 truncate text-[#bdc2c4]'>
              <span
                className={`${
                  tokens[index].source ? '' : 'font-semibold'
                } text-[#280d5f]`}
              >
                {tokens[index].symbol}
              </span>
              <span className='ml-2 font-normal text-xs'>
                {tokens[index].source ? tokens[index].name : ''}
              </span>
            </p>
            <p className='text-sm'>
              {tokens[index].source ? (
                <IconButton
                  className='cursor-default'
                  rightSize='12px'
                  rightSrc={`/images/pancake/${tokens[index].source?.replaceAll(
                    ' ',
                    ''
                  )}.png`}
                >
                  {'via ' + tokens[index].source}
                </IconButton>
              ) : (
                tokens[index].name
              )}
            </p>
          </div>
          <div className='shrink h-full'>
            {tokens[index].source ? (
              <PanButton
                onClick={() => {
                  dispatch(
                    importToken({
                      chainId: chainId,
                      tkn: tokens[index],
                    })
                  );
                  if (source === 'in') {
                    dispatch(setInputCurrency(tokens[index]));
                  } else if (source === 'out') {
                    dispatch(setOutputCurrency(tokens[index]));
                  }

                  close();
                }}
                className='h-full w-24 shrink'
              >
                Import
              </PanButton>
            ) : undefined}
          </div>
        </div>
      ) : (
        <div className='px-5 py-[9px] text-sm font-normal' style={style}>
          <p className='flex items-center justify-between border border-[#e7e3eb] bg-[#faf9fa] w-full px-3 py-2 rounded-lg'>
            <span>{tokens[index].name}</span>
            <IconButton
              className='align-middle cursor-default'
              leftSize='16px'
              leftIcon={<PanQuestionMarkSvg />}
            ></IconButton>
          </p>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <PanModal visible={visible} close={close}>
      <div className='overflow-hidden w-[420px] rounded-[32px] text-[#280d5f] bg-white'>
        <div className='flex py-5 border border-x-transparent border-t-transparent px-6 items-center justify-between'>
          <div className='text-xl font-semibold'>Select a Token</div>
          <IconButton onClick={close} className='active:translate-y-px'>
            <CloseSvg className='w-5 h-5 text-[#1fc7d4]' />
          </IconButton>
        </div>
        <div className='overflow-y-auto max-h-[calc(100vh-56px)] scrollbar-thin scrollbar-thumb-violet-900/80 scrollbar-track-slate-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'>
          <div className='p-5 space-y-3'>
            <input
              value={searchParam}
              onChange={(e) => {
                setSearchParam(e.target.value);
              }}
              placeholder='Search name or paste address'
              className='w-full border border-[#d7caec] bg-[#eeeaf4] rounded-2xl h-12 py-0 px-4 placeholder:text-[#7c70ab] focus:border-[#7645d9] focus:ring focus:outline-none focus:ring-[#ad8fe8]'
              type='text'
            />
            <p className='text-sm'>Common tokens</p>
            <div className='flex items-center justify-around'>
              <IconButton
                onClick={() => {
                  tknClick(NATIVE);
                }}
                className={`hover:bg-[#faf9fa] p-[6px] rounded-xl border border-[#f6f6f6] ${tknClass(
                  NATIVE
                )}`}
                leftSrc={NATIVE.logoURI}
              >
                {NATIVE.symbol}
              </IconButton>
              <IconButton
                onClick={() => {
                  tknClick(TKN1);
                }}
                className={`hover:bg-[#faf9fa] p-[6px] rounded-xl border border-[#f6f6f6] ${tknClass(
                  TKN1
                )}`}
                leftSrc={TKN1.logoURI}
              >
                {TKN1.symbol}
              </IconButton>
              <IconButton
                onClick={() => {
                  tknClick(TKN2);
                }}
                className={`hover:bg-[#faf9fa] p-[6px] rounded-xl border border-[#f6f6f6] ${tknClass(
                  TKN2
                )}`}
                leftSrc={TKN2.logoURI}
              >
                {TKN2.symbol}
              </IconButton>
              <IconButton
                onClick={() => {
                  tknClick(TKN3);
                }}
                className={`hover:bg-[#faf9fa] p-[6px] rounded-xl border border-[#f6f6f6] ${tknClass(
                  TKN3
                )}`}
                leftSrc={TKN3.logoURI}
              >
                {TKN3.symbol}
              </IconButton>
            </div>
          </div>
          {!tokens || tokens?.length === 0 ? (
            <div className='text-center text-[#7a6eaa]'>No results found.</div>
          ) : (
            <List
              className='scrollbar-thin scrollbar-thumb-violet-900/80 scrollbar-track-slate-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'
              height={392}
              itemCount={tokens.length}
              itemSize={56}
              width={'100%'}
            >
              {Row}
            </List>
          )}

          <div className='p-5 text-center'></div>
        </div>
      </div>
    </PanModal>
  );
};
