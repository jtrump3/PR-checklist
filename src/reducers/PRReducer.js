import * as types from '../actions/ActionTypes';  
import { initialState } from "./initialState"

export default function PRReducer(state = initialState, action) {  
  switch(action.type) {
    case types.LOAD_PRS_SUCCESS:
      return action.PR;
    case types.ADD_PR_SUCCESS:
      return action.PR;
    case types.DELETE_PR_SUCCESS:
      return action.PR;
    case types.UPDATE_PR_SUCCESS:
      return action.PR;
    case types.ADD_FILE_SUCCESS:
      return action.PR;
    default: 
      return state;
  }
}