import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a TypeScript type for the user
interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  token?: string;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.token = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, setToken } = UserSlice.actions;
export default UserSlice.reducer;
