import React, { Component } from 'react';
import Loader from './Loader';
import AlertBox from './AlertBox';

export default class CitySearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleCurrentPositionClick = this.handleCurrentPositionClick.bind(this);
    this.handleTypeCity = this.handleTypeCity.bind(this);
    this.searchTypedCity = this.searchTypedCity.bind(this);
    this.showError = this.showError.bind(this);
    this.showPosition = this.showPosition.bind(this);
  }
  handleCurrentPositionClick(e){
    if (navigator.geolocation) {
        var secureProtocol = (window.location.protocol === 'https:');
        var localhost = (window.location.toString().indexOf("localhost") !== -1);
        if(secureProtocol || localhost){
          navigator.geolocation.getCurrentPosition(this.showPosition);
        }else{
          this.showError("Sorry, but only secure origins are allowed.");
        }
    } else { 
        this.showError("Geolocation is not supported by this browser.");
    }
  }
  showPosition(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    this.props.chooseGeoPosition(latitude,longitude);
    this.loader.showLoader();
  }
  handleTypeCity(e){
    if(e.keyCode===13){
      this.searchTypedCity();
    }
  }
  searchTypedCity(){
    var typedCity = document.getElementById("inputTypedCity").value;
    if(typedCity === ""){
      this.showError("Please write a city name.");
    }else{
      this.props.chooseCity(typedCity);
      this.loader.showLoader();
    }
  }
  showError(strMessage){
    this.loader.hideLoader();
    this.alertBox.showError(strMessage);
  }
  showLoader(){
    this.loader.showLoader();
  }
	render() {
		return(
			<div className="whitebox citysearchbox">
        <Loader ref={instance => { this.loader = instance; }}/> 
        <AlertBox ref={instance => { this.alertBox = instance; }}/> 
        <div className="whitebox-content">
        	<input id="inputTypedCity" type="text" placeholder="City" className="inputCity" onKeyUp={this.handleTypeCity}/>
            <i className="material-icons searchIcon" onClick={this.searchTypedCity}>search</i>
          <p>or</p>
          <p>use my <span className="currentPositionLink" onClick={this.handleCurrentPositionClick} >current position</span></p>
        </div>
      </div>
		);
	}
}