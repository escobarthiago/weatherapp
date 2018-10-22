import React, { Component } from 'react';

export default class Loader extends Component {
	constructor(props) {
	    super(props);
	    this.showLoader = this.showLoader.bind(this);
	    this.hideLoader = this.hideLoader.bind(this);
	}

	showLoader(){
		document.getElementById("loaderBox").style.display = "block";
	}

	hideLoader(){
		document.getElementById("loaderBox").style.display = "none";	
	}

	render() {
		return(
			<div className="loaderBox" id="loaderBox">
        		<div className="loadMessage">
        			Loading weather informations.
        		</div>
      		</div>
		);
	}
}