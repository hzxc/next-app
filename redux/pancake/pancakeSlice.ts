import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseTokens } from 'data/pancake';
import { RootState } from 'redux/store';

export interface IToken {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
  logoURI?: string;
  source?: string;
}

interface PancakeState {
  inputCurrency: IToken;
  outputCurrency: IToken;
}

const initialState: PancakeState = {
  inputCurrency: baseTokens[0],
  outputCurrency: baseTokens[1],
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
