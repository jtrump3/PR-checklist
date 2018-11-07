import * as types from '../actions/ActionTypes';  
import { initialState } from "./initialState"

export default function FileReducer(state = initialState.PRs[0], action) {  
  switch(action.type) {
    case types.ADD_FILE_SUCCESS:
      return action.file;
    case types.DELETE_FILE_SUCCESS:
      return action.file;
    case types.UPDATE_FILE_SUCCESS:
      return null;
    default: 
      return state;
  }
}