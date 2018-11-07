import PRApi from "../api/PRApi";
import * as types from './ActionTypes';  


export function loadPRsSuccess(PR) {  
  return {type: types.LOAD_PRS_SUCCESS, PR};
}
export function addPRSuccess(PR){
  return{type: types.ADD_PR_SUCCESS, PR};
}
export function deletePRSuccess(PR){
  return{type: types.DELETE_PR_SUCCESS, PR};
}
export function updatePRSuccess(PR){
  return{type: types.UPDATE_PR_SUCCESS, PR};
}

export function loadPRs() {  
  return function(dispatch) {
    return PRApi
    .loadPRs()
    .then(PR => {
      dispatch(loadPRsSuccess(PR));
    }).catch(error => {
      throw error;
    });
  };
}
export function addPR(PR) {
  return function(dispatch) {
    return PRApi
    .addPR(PR)
    .then(responsePR => {
      dispatch(addPRSuccess(responsePR));
    }).catch(error =>{
      throw(error);
    });
  };
}
export function deletePR(PRId) {
  return function(dispatch) {
    return PRApi
    .deletePR(PRId)
    .then(responsePR => {
      dispatch(deletePRSuccess(responsePR));
    }).catch(error =>{
      throw(error);
    })
  }
}
export function updatePRTitle(title, PRId) {
  return function(dispatch) {
    return PRApi
    .updatePRTitle(title, PRId)
    .then(responsePR => {
      dispatch(updatePRSuccess(responsePR));
    }).catch(error =>{
      throw(error);
    })
  }
}