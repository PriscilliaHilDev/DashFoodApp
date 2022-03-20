import { SHOW_MENU } from "../actions/types";

const initStateMenu = null

const menu = (state= initStateMenu, action) => {

    switch(action.type) {
        case SHOW_MENU:
            return action.payload;
        break;

        default:
        break;
    }

    return state;
}

export default menu;