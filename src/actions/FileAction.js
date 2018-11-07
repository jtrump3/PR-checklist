import FileApi from "../api/FileApi";
import * as types from './ActionTypes';  

export function addFileSuccess(file){
  return{type: types.ADD_FILE_SUCCESS, file};
}
export function deleteFileSuccess(file){
  return{type: types.DELETE_FILE_SUCCESS, file};
}
export function updateFileSuccess(file){
  return{type: types.UPDATE_FILE_SUCCESS, file};
}
export function addFile(PR, PRId) {
  return function(dispatch) {
    return FileApi
    .addFile(PR, PRId)
    .then(responseFile => {
      dispatch(addFileSuccess(responseFile));
    }).catch(error =>{
      throw(error);
    });
  };
}
export function deleteFile(PRId,fileId) {
  return function(dispatch) {
    return FileApi
    .deleteFile(PRId,fileId)
    .then(responseFile => {
      dispatch(deleteFileSuccess(responseFile));
    }).catch(error =>{
      throw(error);
    })
  }
}
export function updateFile(PRId, fileId, file, PR) {
  return function(dispatch) {
    return FileApi
    .updateFile(PRId, fileId, file, PR)
    .then(responsePR => {
      dispatch(updateFileSuccess(responsePR));
    }).catch(error =>{
      throw(error);
    })
  }
}