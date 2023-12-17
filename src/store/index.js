import { createStore, combineReducers, applyMiddleware } from "redux";
import keplerGlReducer from 'kepler.gl/reducers';
import { taskMiddleware } from 'react-palm/tasks';
import { thunk } from "redux-thunk";

const reducers = combineReducers({
    keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(thunk, taskMiddleware));
export default store