import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        updateApplicantStatus: (state, action) => {
            const { id, status } = action.payload;
            const target = state.applicants?.applications?.find(app => app._id === id);
            if (target) {
                target.status = status;
            }
        }
    }
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
