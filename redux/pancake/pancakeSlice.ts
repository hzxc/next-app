import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { bscBusdAddr } from 'data/constants';
import { tokens56 } from 'data/baseTokens';
import { RootState } from 'redux/store';

export interface IToken {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
  projectLink?: string;
  logoURI?: string;
  source?: string;
}

interface PancakeState {
  inputCurrency: IToken;
  outputCurrency: IToken;
  // bscUrl: string;
}

const initialState: PancakeState = {
  inputCurrency: tokens56[0],
  outputCurrency: tokens56[1],
  // bscUrl: bscBusdAddr.
};

export const pancakeSlice = createSlice({
  name: 'pancake',
  initialState,
  reducers: {
    setInputCurrency: (state, action: PayloadAction<IToken>) => {
      state.inputCurrency = { ...action.payload };
    },
    setOutputCurrency: (state, action: PayloadAction<IToken>) => {
      state.outputCurrency = { ...action.payload };
    },
  },
});

export const { setInputCurrency, setOutputCurrency } = pancakeSlice.actions;

export const selectPancake = (state: RootState) => state.pancake;

export default pancakeSlice.reducer;
