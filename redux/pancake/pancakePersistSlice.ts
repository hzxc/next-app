import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { baseTokens } from '../../data/pancake/baseTokens';
import { IToken } from './pancakeSlice';

interface PancakePersistState {
  baseTokens: IToken[];
  tokens: IToken[] | null;
}

const initialState: PancakePersistState = {
  baseTokens: baseTokens,
  tokens: null,
};
export const pancakePersistSlice = createSlice({
  name: 'pancakePersist',
  initialState,
  reducers: {
    importToken: (state, action: PayloadAction<IToken>) => {
      state.baseTokens.push({ ...action.payload, source: undefined });

      if (state.tokens) {
        const idx = state.tokens.findIndex((e) => {
          return e.address === action.payload.address;
        });
        if (idx) {
          state.tokens.splice(idx, 1);
        }
      }
    },
    setBaseTokens: (state, action: PayloadAction<IToken[]>) => {
      state.baseTokens = action.payload;
    },
    setTokens: (state, action: PayloadAction<IToken[]>) => {
      state.tokens = action.payload;
    },
  },
});

export const { setTokens, setBaseTokens, importToken } =
  pancakePersistSlice.actions;

export const selectPancakePersist = (state: RootState) => state.pancakePersist;

export default pancakePersistSlice.reducer;
