import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  email: null,
  id: null,
  token: null,
  role: null,
  isAuth: false,
  name: null,
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
      state.name = action.payload.name;
    },
    removeUser(state) {
      state.email = null;
      state.id = null;
      state.token = null;
      state.role = null;
      state.isAuth = false;
      state.name = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
