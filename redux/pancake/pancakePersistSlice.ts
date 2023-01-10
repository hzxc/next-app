import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tokens97 } from 'data/baseTokens';
import { ChainId } from 'eth';
import { RootState } from 'redux/store';
import { tokens56 } from '../../data/baseTokens/56';
import { IToken } from './pancakeSlice';

interface PancakePersistState {
  // baseTokens: IToken[];
  // tokens: IToken[] | null;
  baseTokens: Record<number, IToken[]>;
  tokens: Record<number, IToken[]>;
  // baseTokensRc: Record<number, IToken[]>;
  // tokenRc: Record<number, IToken[]>;
}

const initialState: PancakePersistState = {
  // baseTokens: baseTokens,
  // tokens: null,
  baseTokens: { 56: tokens56, 97: tokens97 },
  tokens: {},
};
export const pancakePersistSlice = createSlice({
  name: 'pancakePersist',
  initialState,
  reducers: {
    importToken: (
      state,
      action: PayloadAction<{ chainId: number; tkn: IToken }>
    ) => {
      state.baseTokens[action.payload.chainId].push({
        ...action.payload.tkn,
        name: `Added by user•${action.payload.tkn.name}`,
        source: undefined,
      });

      // if (state.tokens) {
      const idx = state.tokens[action.payload.chainId].findIndex((e) => {
        return e.address === action.payload.tkn.address;
      });

      if (idx >= 0) {
        state.tokens[action.payload.chainId].splice(idx, 1);
      }
      // }
    },
    setBaseTokens: (
      state,
      action: PayloadAction<{ chainId: number; tkns: IToken[] }>
    ) => {
      state.baseTokens[action.payload.chainId] = action.payload.tkns;
    },
    setTokens: (
      state,
      action: PayloadAction<{ chainId: number; tkns: IToken[] }>
    ) => {
      state.tokens[action.payload.chainId] = action.payload.tkns;
    },
  },
});

export const { setTokens, setBaseTokens, importToken } =
  pancakePersistSlice.actions;

export const selectPancakePersist = (state: RootState) => state.pancakePersist;

export default pancakePersistSlice.reducer;
