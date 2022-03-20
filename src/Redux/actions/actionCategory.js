import {LOADING_DATA, NOTIF} from "./types";

// payload action retournée
export const loadingData = (payload) => ({
    type: LOADING_DATA,
    payload
})

export const notifAction = (payload) => ({
    type: NOTIF,
    payload
})