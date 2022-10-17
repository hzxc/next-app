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
  baseTokens: IToken[];
  tokens: IToken[];
  // inputCurrency: string;
  // outputCurrency: string;
}

const initialState: PancakeState = {
  baseTokens: baseTokens,
  tokens: [],
};

export const pancakeSlice = createSlice({
  name: 'pancake',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<IToken[]>) => {
      state.tokens = [...action.payload];
    },
  },
});

export const { setTokens } = pancakeSlice.actions;

export const selectPancake = (state: RootState) => state.pancake;

export default pancakeSlice.reducer;
