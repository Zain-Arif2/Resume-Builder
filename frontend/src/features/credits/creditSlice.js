import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  upgradeModalOpen: false,
};

const creditSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    openUpgradeModal: (state) => {
      state.upgradeModalOpen = true;
    },
    closeUpgradeModal: (state) => {
      state.upgradeModalOpen = false;
    },
  },
});

export const { openUpgradeModal, closeUpgradeModal } = creditSlice.actions;
export default creditSlice.reducer;
export const selectUpgradeModalOpen = (state) => state.credits.upgradeModalOpen;
