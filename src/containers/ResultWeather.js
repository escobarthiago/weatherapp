import React, { Component } from 'react';

export default class ResultWeather extends Component {
  constructor(props) {
    super(props);
    this.state = {"temperatureScale": "fahrenheit"};
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleScaleToogleClick = this.handleScaleToogleClick.bind(this);
    this.convertTemperature = this.convertTemperature.bind(this);
    this.setScaleTemperature = this.setScaleTemperature.bind(this);
  }

  handleBackButtonClick(){
    this.props.backToChoose();
  }

  handleScaleToogleClick(){
    if(this.state.temperatureScale === "fahrenheit"){
      this.setScaleTemperature('celsus');
    }else{
      this.setScaleTemperature('fahrenheit');
    }
  }
  setScaleTemperature(scale){
    if(scale === "fahrenheit"){
      localStorage.setItem('weatherapp-tempScale', 'fahrenheit');
      this.setState({temperatureScale: "fahrenheit"});
      document.getElementById("scaleToogle").innerHTML = "toggle_on";
    }else{
      localStorage.setItem('weatherapp-tempScale', 'celsus');
      this.setState({temperatureScale: "celsus"});
      document.getElementById("scaleToogle").innerHTML = "toggle_off";
    }
  }
  convertTemperature(kelvinTemp){
    if(this.state.temperatureScale === "fahrenheit"){
      return Math.floor(((kelvinTemp - 273.15)*(9/5)) + 32);
    }else{
      return Math.floor(kelvinTemp - 273.15);
    }
  }

  getIconById(weatherId){
    var icon = "wi ";
    weatherId = parseInt(weatherId);
    if(weatherId>199 && weatherId<300){
      icon += "wi-day-snow-thunderstorm";
    }else if(weatherId>299 && weatherId<400){
      icon += "wi-day-sprinkle";
    }else if(weatherId>499 && weatherId<600){
      icon += "wi-day-rain";
    }else if(weatherId>599 && weatherId<700){
      icon += "wi-day-snow";
    }else if(weatherId>699 && weatherId<800){
      icon += "wi-day-windy";
    }else if(weatherId>800 && weatherId<900){
      icon += "wi-day-cloudy";
    }else{
      icon += "wi-day-sunny";
    }
    return icon;
  }

  getWeekDay(daysFromToday){
    var numWeekDay = new Date().getDay()+daysFromToday;
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if(numWeekDay>6){
      numWeekDay = numWeekDay-7;
    }
    //return("XXXXXXXXXX");
    return(weekday[numWeekDay]);
  }

  getFullDate(){
    var date = new Date();
    var strFullDate;
    var monthNumber = date.getMonth();
    var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    strFullDate = monthName[monthNumber]+" ";
    var dayNumber = date.getDate();
    var daySuffix;
    switch(dayNumber){
      case 1:
        daySuffix = "st";
        break;
      case 2:
        daySuffix = "nd";
        break;
      case 3:
        daySuffix = "rd";
        break;
      default:
        daySuffix = "th";
    }
    strFullDate += dayNumber+daySuffix+" ";
    var year = date.getFullYear();
    strFullDate += year;
    return strFullDate;
  }

  getTodayTemperature(){
    var arrTemp = this.props.objWeather.arrTodayResults;
    var finalTemperature = null;
    var contTemp = 0;
    while(finalTemperature === null){
      if(arrTemp[contTemp].name!=="Morning"){
        finalTemperature = arrTemp[contTemp].temperature;
      }
      contTemp++;
    }
    return finalTemperature;
  }

	render() {
    var today = this.getWeekDay(0);
    var todayDate = this.getFullDate();
    var todayWeather = this.props.objWeather.results[0].weather;
    var highlightTemperature = this.convertTemperature(this.getTodayTemperature());
    var temperatureScaleLetter = (this.state.temperatureScale==="fahrenheit"?"F":"C");
    var todaysWeatherIcon = this.getIconById(this.props.objWeather.results[0].weatherId);
    var listTodayTemperatures = this.props.objWeather.arrTodayResults.map((result, i) =><div key={'result_'+i}>
      <div className="todayWeather-left">{result.name}</div>
      <div className="todayWeather-right">{this.convertTemperature(result.temperature)}<i className="wi wi-degrees"></i>{temperatureScaleLetter}</div>
      </div>
    );
    var listNextDaysTemperatures = this.props.objWeather.results.map((result, i)=><div key={'weekresult_'+i} className={this.props.objWeather.results.length===6?"dayWeather next6days nextDay-"+(i+1):"dayWeather next5days nextDay-"+(i+1)}>
        <p>{this.getWeekDay(i)}</p>
        <i className={this.getIconById(result.weatherId)}></i>
        <p>{this.convertTemperature(result.temperature)}<i className="wi wi-degrees"></i> {temperatureScaleLetter}</p>
      </div>
    );
		return(
			<div className="whitebox">
        <div className="result-whitebox-content">
          <div className="firstLineResults">
            <div className="backButton">
              <i className="material-icons" onClick={this.handleBackButtonClick}>keyboard_backspace</i>
            </div>
            <div className="cityName">{this.props.city}</div>
            <div className="scaleChooser" onClick={this.handleScaleToogleClick}>
              <div className="scaleIcon">
                F<i className="wi wi-degrees"></i>
              </div>
              <i className="material-icons scaleToogle" id="scaleToogle">
                {this.state.temperatureScale === "fahrenheit"?"toggle_on":"toggle_off"}
              </i>
              <div className="scaleIcon">
                C<i className="wi wi-degrees"></i>
              </div>
            </div>
          </div>
          <div className="dateLineResults">{today}, {todayDate}<br/><span>{todayWeather}</span></div>
          <div className="todayWeatherLineResults">
            <div className="todayWeatherColumn">
              {highlightTemperature}<i className="wi wi-degrees"></i>{temperatureScaleLetter}
            </div>
            <div className="todayWeatherColumn weatherIcon">
              <i className={todaysWeatherIcon}></i>
            </div>
            <div className="todayWeatherColumn detailedTemperature">
              {listTodayTemperatures}
            </div>
          </div>
          <div className="nextDaysWeatherResult">
            {listNextDaysTemperatures}
          </div>
        </div>
      </div>
		);
	}
  componentDidMount(){
    var tempScale = localStorage.getItem('weatherapp-tempScale');
    if(tempScale!==null && tempScale!== ""){
      this.setScaleTemperature(tempScale);
    }
  }
}