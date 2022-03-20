import { LOADING_DATA,NOTIF } from "../actions/types";

const initStateCategoryActions = { 
    loadingData:false,
    notif:false,
}

const actionCategory = (state= initStateCategoryActions, action) => {

    switch(action.type) {
        case LOADING_DATA:
            return {...state, loadingData: action.payload};
        break;
        case NOTIF:
            return {...state, notif: action.payload};
        break;

        default:
        break;
    }

    return state;
}

export default actionCategory;