import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url =
  "https://api.allorigins.win/raw?url=https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: [],
  amount: 4,
  total: 0,
  isLoading: false,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (test, thunkAPI) => {
    // can do async (thunkAPI)
    //access thunkAPI.getState() will give you access to all of the state in the app, can select specific state from there for example thunkAPI.getState(modal)
    //can also dispatch, thunkAPI.dispatch, ex thunkAPI.dispatch(openModal)
    //if you pass down something in the component for this one it would be getCartItems(whatever) and then here you could do async (whatever)

    try {
      const res = await axios(url);
      console.log(res);
      if (res.data.msg) {
        console.error(res.data.msg);
        return ["error", res.data.msg];
      }
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("There was an error");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const item = state.cartItems.find((item) => item.id == payload.id);
      item.amount = item.amount + 1;
    },
    decrease: (state, { payload }) => {
      const item = state.cartItems.find((item) => item.id == payload.id);
      item.amount = item.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      if (state.cartItems[0] !== "error") {
        state.cartItems.forEach((item) => {
          amount += item.amount;
          total += item.amount * item.price;
        });
      }
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload;
    },
    [getCartItems.rejected]: (state, action) => {
      console.log(action);
      state.isLoading = false;
    },
  },
});
export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
