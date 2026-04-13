import type { AuthState } from "@/models/IAuth"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState: AuthState = {
  token: null,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: AuthState['user']; token: string }>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout(state) {
      state.token = null
      state.user = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer