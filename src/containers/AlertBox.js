import React, { Component } from 'react';

export default class AlertBox extends Component {

	constructor(props) {
	    super(props);
	    this.handleCloseClick = this.handleCloseClick.bind(this);
	    this.showError = this.showError.bind(this);
	}

	handleCloseClick(e){
		document.getElementById("alertBox").style.display = "none";
	}

	showError(strMessage){
		document.getElementById("alertMessage").innerHTML = strMessage;
		document.getElementById("alertBox").style.display = "block";
	}
	render() {
		return(
			<div className="alertBox" id="alertBox">
				<div className="closeAlertBox" onClick={this.handleCloseClick}>
					<i className="material-icons">close</i>
				</div>
				<div className="alertMessage" id="alertMessage"></div>
      		</div>
		);
	}

}