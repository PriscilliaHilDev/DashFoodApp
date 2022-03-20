import {LISTPRODUCTS} from "./types";

// payload action retournée
export const getListProducts = (payload) => ({
    type: LISTPRODUCTS,
    payload
})