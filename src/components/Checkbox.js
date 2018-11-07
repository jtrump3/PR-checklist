import * as React from "react";
import "./Checkbox.scss";

class CheckBox extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="field">
        <div className="model-list-item-chkbox">
          <input type="checkbox" checked={this.props.checked} value={`${this.props.file}/${this.props.value}`} onChange={this.props.handleChange} />
          <label>&#10003;</label>
        </div>
      </div>
    );
  }
}

export default CheckBox;