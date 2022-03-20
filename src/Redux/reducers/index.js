import { combineReducers } from "redux";
import produits from "./produits";
import menu from './menu'
import loading from "./loading";
import actionCategory from "./actionCategory";

// concatenation de tout les objets reducers
export default combineReducers({produits, menu, loading, actionCategory})