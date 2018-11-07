import initialState from "../reducers/PRReducer";
import "isomorphic-fetch";
class PRApi {  
    static loadPRs() {
      return fetch("https://PR-approval-checklist.firebaseio.com/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX")
      .then(response => {
        return response.json();
      }).catch(error => {
        return initialState;
      });
    }

    static addPR(PR){
      const url = "https://PR-approval-checklist.firebaseio.com/PRs/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
        let data = (JSON.stringify(PR));
        const request = new Request(url,{
          method: 'POST',  
          headers: new Headers({
              'Content-Type': 'application/json'  
        }),
        body: data
      });
      return fetch(request)
      .then( () => { 
        return fetch("https://PR-approval-checklist.firebaseio.com/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX").then(response => {
          return response.json();
        }).catch(error => {
          return initialState;
        });
      }).catch(error => {
        return error;
      });
    }

    static deletePR(PRId){
      const url = "https://PR-approval-checklist.firebaseio.com/PRs/"+PRId+"/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      const listUrl = "https://PR-approval-checklist.firebaseio.com/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
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
    static updatePRTitle(title, PRId){
      const url = "https://PR-approval-checklist.firebaseio.com/PRs/"+PRId+"/title/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      const listUrl = "https://PR-approval-checklist.firebaseio.com/.json?auth="+"n7zP8kQH0iVWRYhCREgdrzAgS5ZgC9exPFY6nPFX";
      let data = (JSON.stringify(title));
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
    
}
  
export default PRApi;