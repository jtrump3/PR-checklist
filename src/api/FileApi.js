import initialState from "../reducers/FileReducer";
import "isomorphic-fetch";
class FileApi {  
    static addFile(PR, PRId){
      const url = "https://PR-approval-checklist.firebaseio.com/PRs/"+PRId+"/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      const listUrl = "https://PR-approval-checklist.firebaseio.com/PRs/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
        let data = (JSON.stringify(PR));
        const request = new Request(url,{
          method: 'PUT',  
          headers: new Headers({
              'Content-Type': 'application/json'  
        }),
        body: data
      });
      return fetch(request).then( () => { 
        return fetch(listUrl).then(response => {
          return response.json();
        }).catch(error => {
          return initialState;
        });
      }).catch(error => {
        return error;
      });   
    }

    static deleteFile(PRId, fileId){
      const url = "https://PR-approval-checklist.firebaseio.com/PRs/"+PRId+"/files/"+fileId+"/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      const listUrl = "https://PR-approval-checklist.firebaseio.com/PRs/"+PRId+"/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      const request = new Request(url,{
        method: 'DELETE',
      });
      return fetch(request).then( () => { 
        return fetch(listUrl).then(response => {
          return response.json();
        }).catch(error => {
          return initialState;
        });
      }).catch(error => {
        return error;
      });   
    }
    static updateFile(PRId, fileId, file, PR){
      const url = "https://PR-approval-checklist.firebaseio.com/PRs/"+PRId+"/files/"+fileId+"/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      let data = (JSON.stringify(file));
      const request = new Request(url,{
        method: 'PUT',  
        headers: new Headers({
            'Content-Type': 'application/json'  
      }),
      body: data
    });
      return fetch(request).then( () => { 
        return PR;
      }).catch(error => {
        return error;
      });   
    }
    
}
  
export default FileApi;