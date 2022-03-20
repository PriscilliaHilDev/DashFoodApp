import { LISTPRODUCTS } from "../actions/types";

const initStatePlat = []

//constante du reducer fonction pour utiliser le reducer
const produits = (state= initStatePlat, action) => {

    // console.log("reducer plat", state, action) 
    switch(action.type) {
        case LISTPRODUCTS:
            return action.payload;
        break;

        default:
        break;
    }

    return state;
}

export default produits;