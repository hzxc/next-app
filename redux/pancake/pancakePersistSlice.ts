import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { baseTokens } from '../../data/pancake/baseTokens';
import { IToken } from './pancakeSlice';

interface PancakePersistState {
  baseTokens: IToken[];
  tokens: IToken[] | null;
  // loadedAt: string | null;
}

const initialState: PancakePersistState = {
  baseTokens: baseTokens,
  tokens: null,
  // loadedAt: null,
};
export const pancakePersistSlice = createSlice({
  name: 'pancakePersist',
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<IToken>) => {
      state.baseTokens.push(action.payload);
    },
    setBaseTokens: (state, action: PayloadAction<IToken[]>) => {
      state.baseTokens = action.payload;
    },
    setTokens: (state, action: PayloadAction<IToken[]>) => {
      state.tokens = action.payload;
    },
  },
});

export const { setTokens, setBaseTokens } = pancakePersistSlice.actions;

export const selectPancakePersist = (state: RootState) => state.pancakePersist;

export default pancakePersistSlice.reducer;
