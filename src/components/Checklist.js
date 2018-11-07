import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';  
import {bindActionCreators} from 'redux';
import * as PRActions from "../actions/PRAction";
import { initialState } from "../reducers/PRReducer"
import Checkbox from "./Checkbox";
import 'babel-polyfill';
    import {
        BrowserRouter as Router,
        Route,
        Link,
        Switch,
} from 'react-router-dom'

class Checklist extends Component{
    constructor(props){
        super(props);
    } 
    createLists(){
        let lists = [];
        let renderLists = [];
        const items = this.props.checklist;
        this.props.checklist;
        let item = 0;
        for(let i = 0; i < 3; i++){
            lists.push([])
            for(let j = 0; j < (items.length/3); j++){
                lists[i].push(items[item++])
            }      
        }
        for(let i = 0; i < 3; i++){
            renderLists.push(
                <ul className="list-group col-md-4" key={i}>
                    {lists[i].map((item) =>
                        <li className="list-group-item small pb-0" key={Object.keys(item)}>
                            <span className="d-inline-block small">{Object.keys(item)}</span>
                            <span className="d-inline-block float-right mb-2">
                                <Checkbox checked={Object.values(item)[0]} value={Object.keys(item)} file={this.props.fileName} handleChange={this.props.onPRChange}/>
                            </span>
                        </li>
                    )}
                </ul>
            )
        }
        return renderLists;
    }
    render() {
        return(
            <div className="row ml-2">
                {this.createLists()}
            </div>
        );
    }
}

  export default Checklist;