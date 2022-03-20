import {LOADING_PHOTO, ID_PRODUCT} from "./types";

// payload action retournée
export const loadingPhoto = (payload) => ({
    type: LOADING_PHOTO,
    payload
})

export const idChangePhoto = (payload) => ({
    type: ID_PRODUCT,
    payload
})