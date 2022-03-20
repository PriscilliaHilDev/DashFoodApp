import { LOADING_PHOTO,ID_PRODUCT } from "../actions/types";

const initStateLoading = { 
    loadingPhoto:false,
    idProduct:null,
    data:null,
}

const loading = (state= initStateLoading, action) => {

    switch(action.type) {
        case LOADING_PHOTO:
            return {...state, loadingPhoto: action.payload};
        break;
        case ID_PRODUCT:
            return {...state, idProduct: action.payload};
        break;

        default:
        break;
    }

    return state;
}

export default loading;