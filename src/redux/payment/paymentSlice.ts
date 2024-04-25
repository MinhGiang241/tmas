import { createSlice } from "@reduxjs/toolkit";

interface PaymentState {
  loading?: boolean;
  type?: "Gold" | "Package";
  price?: number;
  name?: string;
  goldId?: string;
  packageId?: string;
}

const initialState: PaymentState = {
  loading: false,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state, action) => {
      return { loading: false };
    },
    setPayment: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { resetPayment, setPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
