
import { configureStore } from '@reduxjs/toolkit';
import client_slice from './client-slice';
import ui_slice from './ui-slice';

export default configureStore({
    reducer: {
        client: client_slice,
        ui: ui_slice,
    },
});
