import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
}

const initialState: ThemeState = {
  mode: 'system', 
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
    },
    resetTheme: (state) => {
      state.mode = 'system' 
    },
  },
})

export const { setTheme, resetTheme } = themeSlice.actions
export default themeSlice.reducer