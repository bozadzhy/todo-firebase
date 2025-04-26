import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  email: null,
  id: null,
  token: null,
  role: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuth = true;
    },
    removeUser(state) {
      state.email = null;
      state.id = null;
      state.token = null;
      state.role = null;
      state.isAuth = false;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;