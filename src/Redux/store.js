import {createStore} from "redux";
// index du reducer qui contient tous les variable de nos reducers
import rootReducer from "./reducers"


export default createStore(rootReducer)