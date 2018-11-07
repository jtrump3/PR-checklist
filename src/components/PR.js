import React from "react";
import {connect} from 'react-redux';  
import {bindActionCreators} from 'redux';
import * as FileActions from "../actions/FileAction";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect,
} from 'react-router-dom'
import {initialState} from "../reducers/initialState";
import Checklist from "./Checklist";
import { updateFile } from "../actions/FileAction";

class Files extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            filesArray: [],
            fileIds: [],
            newFileTitle: "",
        }
        this.updatePRState = this.updatePRState.bind(this);
        this.getFileTitle = this.getFileTitle.bind(this);
        this.createNewFile = this.createNewFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }
    componentDidMount(){
        this.setState({
            fileIds: Object.keys(this.props.PR.files),
            filesArray: Object.keys(this.props.PR.files).map(i => this.props.PR.files[i])
        })
    }

    deleteFile(event){
        const PRId = this.props.match.params.PRId;
        let index = 0
        for(let file of this.state.filesArray){
            if(file.title === event.target.value){
                break;
            }
            index++
        }
        let updatedFiles = this.state.filesArray
        updatedFiles.splice(index,1)
        this.setState({filesArray: updatedFiles})
        this.props.actions.deleteFile(PRId,this.state.fileIds[index]);
    }
    createNewFile(){
        let check = this.checkFileTitle(this.state.newFileTitle)
        if(check === true){
            let updatedFiles = this.state.filesArray
            let newFile = initialState.PRs[0].files[0];
            newFile.title = this.state.newFileTitle;
            console.log(updatedFiles)
            console.log(newFile)
            if(this.state.filesArray[0].title === ""){
                updatedFiles[0] = newFile;
            }else{
                updatedFiles.push(newFile);
            }
            console.log(newFile)
            console.log(updatedFiles)
            let newId = Number(this.state.fileIds[this.state.fileIds.length-1]) +1
            let updatedIds = this.state.fileIds
            updatedIds.push(String(newId))
            this.setState({
                filesArray: updatedFiles, 
                fileIds: updatedIds 
            })
            let PR = this.props.PR
            PR.files = this.state.filesArray;
            this.props.actions.addFile(PR, this.props.match.params.PRId)
            document.getElementById("invalid-title-alert").innerHTML =
            '<div class="alert alert-success alert-dismissible fade show" role="alert">' + 
                 '<strong>Checklist for ' + newFile.title + ' has been generated!</strong>' +
                 '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>'
        } else{
           document.getElementById("invalid-title-alert").innerHTML =
           '<div class="alert alert-danger alert-dismissible fade show" role="alert">' + 
                '<strong>Unable to create that File! </strong>' + check +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
            '</div>'
        }
    }
    checkFileTitle(title){
        let valid = true;
        for(let file of this.state.filesArray){
            if(file.title === title){
                valid = "This title is already in use"
            }
        }
        if(title.length === 0){valid = "Title cannot be left blank"}
        return(valid);
    }
   
    
    renderFileList(){
        let files = this.state.filesArray;
        let fileList = [];
        for(let file of files){
            if(file.title !== ""){
                const conventions = file.conditions;
                let conventionsMet = 0;
                for(let convention of conventions){
                    if(Object.values(convention)[0]){conventionsMet++}
                }
                const percent = ((conventionsMet/conventions.length)*100).toFixed(0);
                let percentStyle = {}
                let filler = ""
                if(percent < 10) filler = "btn btn-dark pl-4 pr-4";
                else if(percent < 60) filler = "btn btn-danger pl-3 pr-3"; 
                else if(percent < 100 )filler = "btn btn-warning pl-3 pr-3"
                else filler = "btn btn-success";

                fileList.push(
                <div className="border-dark" key={file.title}>
                    <div className="card-header" id="headingOne">
                        <div className="btn btn-light border border-info pt-0 pl-3 pb-0 pr-5 w-100" type="button" data-toggle="collapse" data-target={`#${file.title}`} aria-expanded="true" aria-controls="collapseOne">
                            <h4 className="text-dark float-left mt-4">{file.title}</h4>
                            <h4><span style={percentStyle} className={`float-right mb-3 p-2 border border-dark ${filler}`} aria-disabled="true">{percent}%</span></h4>
                            <button 
                                type="button" 
                                className="btn btn-danger d-inline-block float-right mr-4 pt-2 pb-2" 
                                data-target="#deletePR"
                                value={file.title}
                                onClick={this.deleteFile}
                                data-toggle="modal" >
                                Delete
                            </button>
                            {/* <button 
                                type="button" 
                                className="btn btn-info d-inline-block float-right mr-3 pt-2 pb-2 "
                                data-toggle="modal" 
                                data-target="#updatePR"
                                value={file.title}
                                onClick="">
                                Edit
                            </button> */}
                        </div>
                    </div>
                    <div id={file.title} className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div className="card-body">
                            <Checklist 
                            fileName={file.title}
                            checklist={file.conditions}
                            onPRChange={this.updatePRState}
                            />
                        </div>
                    </div>
                </div>
                )
            }
        }
        return fileList;
    }
    getFileTitle(event){
        this.setState({newFileTitle: event.target.value});
    }
    updatePRState(event) {
        let fileTitle = event.target.value.substring(0, event.target.value.indexOf("/"));
        let convention = event.target.value.substring(event.target.value.indexOf("/")+1);
        let changedFile;
        let index = 0;
        for(let file of this.state.filesArray){
            if(file.title === fileTitle){
                for(let i = 0; i < file.conditions.length; i++){
                    if(Object.keys(file.conditions[i])[0] === convention){
                        file.conditions[i][convention] = !Object.values(file.conditions[i])[0];
                        changedFile = file;
                    }
                }
                break;
            }
            index++
        }
        let files = this.state.filesArray;
        files[index] = changedFile;
        this.setState({files: files});
        let PR = this.props.PR;
        PR.files = files;
        this.props.actions.updateFile(this.props.match.params.PRId, this.state.fileIds[index], changedFile, PR);
    }
    render(){
        return(
            <div>
                <div className="jumbotron pt-0">
                    <h1 className="display-4">Files</h1>
                    <h2>{this.props.match.params.prTitle}</h2>
                    <hr className="my-4"/>
                    <Link to="/">
                        <button type="button" className="btn btn-primary mr-4 pr-4">
                            <strong>{`<< `}</strong>Back 
                        </button>
                    </Link>
                    <button type="button" className="btn btn-primary pl-3 pr-3" data-toggle="modal" data-target="#exampleModal">
                        Add a File
                    </button>
                    <div id="invalid-title-alert" className="d-inline-block ml-4 pt-0 pb-0"> </div>

                    <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="exampleModalLabel">New File Checklist</h4>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="input-group mb-3">
                                        <input type="text" placeholder="File Name"  onChange={this.getFileTitle} className="form-control" aria-label="create-pr" aria-describedby="inputGroup-sizing-default" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary"  onClick={this.createNewFile} data-dismiss="modal">Create Checklist</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="list-group align-items-center">
                        <h4>
                            <strong>Available File Checklists:</strong>
                        </h4>
                        <div className="accordion w-100" id="accordionExample">
                            {this.renderFileList()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    let pathname = document.location.pathname;
    let PRTitle = decodeURIComponent(pathname.substring(pathname.lastIndexOf("/")+1))
    let PR
    if(Object.values(state.PRReducer.PRs[0])[0] === ""){
        PR = initialState.PRs[0]
    }else{
        let PRs = Object.keys(state.PRReducer.PRs).map(i => state.PRReducer.PRs[i]);
        for(let aPR of PRs){
            if(aPR.title === PRTitle){
                PR = aPR;
            }
        }
    }

    return {PR:PR};
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(FileActions, dispatch),
    };
  }
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Files);