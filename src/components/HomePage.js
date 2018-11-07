import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';  
import {bindActionCreators, combineReducers} from 'redux';
import * as PRActions from "../actions/PRAction";
import { initialState } from "../reducers/initialState"
import 'babel-polyfill';
import "./Homepage.scss"
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
  } from 'react-router-dom'

class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            newPRTitle: "",
            selectedPR: ""
        }
        this.getPRTitle = this.getPRTitle.bind(this);
        this.createNewPR = this.createNewPR.bind(this);
        this.updatePRTitle = this.updatePRTitle.bind(this);
        this.getSelectedPR = this.getSelectedPR.bind(this);
        this.deletePR = this.deletePR.bind(this);
    } 
    findPRChecklistPercent(filesObj){
        let files = Object.keys(filesObj).map(i => filesObj[i]);
        let totalConventions = 0;
        let conventionsMet = 0;
        for(let file of files){
            const conventions = file.conditions;
            for(let convention of conventions){
                if(Object.values(convention)[0]){conventionsMet++}
                totalConventions++;
            }
        }
        return ((conventionsMet/totalConventions)*100)
    }
    getSelectedPR(event){
        this.setState({selectedPR: event.target.value})
    }
    deletePR(){
        let PRId = this.state.selectedPR.substring(0,this.state.selectedPR.indexOf("/"))
        this.props.actions.deletePR(PRId);
    }
    updatePRTitle(){
        let PRId = this.state.selectedPR.substring(0,this.state.selectedPR.indexOf("/"))
        let check = this.checkPRTitle(this.state.newPRTitle)
        if(check === true){
            this.props.actions.updatePRTitle(this.state.newPRTitle,PRId);
            document.getElementById("invalid-title-alert").innerHTML =
            '<div class="alert alert-success alert-dismissible fade show" role="alert">' + 
                 '<strong>PR Title has been changed to ' + this.state.newPRTitle + ' has been generated!</strong>'
                 '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                     '<span aria-hidden="true">&times;</span>' +
                 '</button>' +
             '</div>'
        } else{
           document.getElementById("invalid-title-alert").innerHTML =
           '<div class="alert alert-danger alert-dismissible fade show" role="alert">' + 
                '<strong>Unable to use that title! </strong>' + check +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
            '</div>'
        }
    }
    createNewPR(){
        let check = this.checkPRTitle(this.state.newPRTitle)
        if(check === true){
            let PR = initialState.PRs[0];
            PR.title = this.state.newPRTitle;
            this.props.actions.addPR(PR);
            document.getElementById("invalid-title-alert").innerHTML =
            '<div class="alert alert-success alert-dismissible fade show" role="alert">' + 
                 '<strong>PR checklist ' + PR.title + '</strong>' +
                 '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                     '<span aria-hidden="true">&times;</span>' +
                 '</button>' +
             '</div>'
        } else{
           document.getElementById("invalid-title-alert").innerHTML =
           '<div class="alert alert-danger alert-dismissible fade show" role="alert">' + 
                '<strong>Unable to create that PR! </strong>' + check +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
            '</div>'
        }
    }
    checkPRTitle(title){
        let valid = true;
        for(let PR of Object.values(this.props.PRs)){
            if(PR.title === title){
                valid = "This title is already in use"
            }
        }
        if(title.length === 0){valid = "Title cannot be left blank"}
        for(let i = 0; i < title.length; i++){
            if(title.charAt(i) === "/"){valid = "Title cannot contain '/' character"}
        }
        return(valid);
    }
    getPRTitle(event){
        this.setState({newPRTitle: event.target.value});
    }
    renderPRList(){
        let prList = [];
        let PRs = [];
        PRs = Object.keys(this.props.PRs).map(i => this.props.PRs[i]);
        for(let PR of PRs){
            const ID = Object.keys(this.props.PRs).find(key => this.props.PRs[key]  === PR);
            const percent = this.findPRChecklistPercent(PR.files).toFixed(1);
            const width = percent +="%";
            prList.push(
                <div className="container-fluid pb-0" key={PR.title}>
                        <div href="#" className="list-group-item list-group-item-action list-group-item-info pb-0 pt-0" style={{textDecoration:"none"}}>
                            <Link to={`${ID}/${PR.title}`} onClick={this.props.getUrl} className="jira-link">
                                <h4 className="d-inline-block w-75">{PR.title}</h4>
                            </Link>
                            <button 
                                type="button" 
                                className="btn btn-danger d-inline-block float-right mt-2 pt-2 pb-2" 
                                data-target="#deletePR"
                                value={`${ID}/${PR.title}`}
                                onClick={this.getSelectedPR}
                                data-toggle="modal" >
                                
                                Delete
                            </button>
                            <Link to={`${ID}/${PR.title}`} onClick={this.props.getUrl} className="jira-link">
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{width: width}} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
                                    <span className="percent">{percent}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                </div>
            )
        }
        return prList;
    }
    render() {
        return(
            <div>
                <div className="jumbotron pt-0">
                    <h1 className="display-4">PR Checklist</h1>
                    <p className="lead">Things to check in your code before submitting a PR for review</p>
                    <hr className="my-4"/>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#createNew">
                        Create New Checklist <span className="glyphicon glyphicon-modal-window"/>
                    </button>
                    <div id="invalid-title-alert" className="d-inline-block ml-4 pt-0 pb-0"> </div>
                    <div className="modal fade" id="createNew" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="exampleModalLabel">New PR Review Checklist</h4>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="input-group mb-3">
                                        <input type="text" 
                                        onChange={this.getPRTitle} 
                                        placeholder="PR Title" 
                                        className="form-control" 
                                        aria-label="create-pr" 
                                        aria-describedby="inputGroup-sizing-default" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.createNewPR} data-dismiss="modal">Create PR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="updatePR" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="exampleModalLabel">New PR Title</h4>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="input-group mb-3">
                                        <input 
                                            type="text" 
                                            onChange={this.getPRTitle} 
                                            placeholder={this.state.selectedPR.substring(this.state.selectedPR.indexOf("/")+1)} 
                                            className="form-control" 
                                            aria-label="create-pr" 
                                            aria-describedby="inputGroup-sizing-default" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={this.updatePRTitle} data-dismiss="modal">Update PR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="deletePR" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="exampleModalLabel">All files will be lost. Continue?</h4>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <button type="button" className="btn btn-danger ml-4 float-right" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary float-right" onClick={this.deletePR} data-dismiss="modal">Delete PR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="list-group align-items-center">
                        <h4>
                            <strong>Available PRs:</strong>
                        </h4>
                        {this.renderPRList()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let PRs = state.PRReducer.PRs;
    return {PRs};
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(PRActions, dispatch),
    };
  }
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HomePage);