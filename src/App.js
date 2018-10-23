import React, { Component } from 'react';
import CitySearchBox from './containers/CitySearchBox';
import ResultWeather from './containers/ResultWeather';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {"city": null, "weather": null};
    this.chooseCity = this.chooseCity.bind(this);
    this.chooseGeoPosition = this.chooseGeoPosition.bind(this);
    this.backToChoose = this.backToChoose.bind(this);
    this.setWeatherData = this.setWeatherData.bind(this);
    this.arrangeWeatherData = this.arrangeWeatherData.bind(this);
  }

  chooseCity(strCity){
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q="+strCity+"&appid=0f142c1ee3c642555b8909b4b728e890";
    this.consultWeatherAPI(strCity, apiUrl);
  }

  chooseGeoPosition(latitude, longitude){
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&appid=0f142c1ee3c642555b8909b4b728e890";
    var strCity = "Your Location<"+latitude+"<"+longitude;
    this.consultWeatherAPI(strCity, apiUrl);
  }

  consultWeatherAPI(strCity, apiUrl){
    var position = null;
    if(strCity.indexOf("<")!==-1){
        position = [strCity.split("<")[1],strCity.split("<")[2]];
        strCity = strCity.split("<")[0];
    }
    var thisComponent = this;
    this.setState({loader: true})
    fetch(apiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if(data.cod==="200"){
          thisComponent.setWeatherData(thisComponent.capitalizeFirstLetter(strCity), thisComponent.arrangeWeatherData(data.list));
          if(position === null){
            localStorage.setItem('weatherapp-lastsearch', 'city:'+strCity);
          }else{
            localStorage.setItem('weatherapp-lastsearch', 'position:'+position[0]+"/"+position[1]);
          }
        }else{
          thisComponent.citySearchBox.showError(thisComponent.capitalizeFirstLetter(data.message)+".");
        }
      }
    );
  }

  setWeatherData(strCity, dataWeather){
    this.setState({city: strCity, weather: dataWeather});
  }

  arrangeWeatherData(originalData){
    var arrWeather = [];
    var firstDayFinded = false;
    for(var wData = 0; wData<originalData.length; wData++){
      var hourData = (originalData[wData].dt_txt).split(" ")[1];
      var dayWeather;
      if(!firstDayFinded){
        if(hourData === "12:00:00" || hourData === "18:00:00" || hourData === "00:00:00" ){
          firstDayFinded = true;
          dayWeather = {
            temperature: originalData[wData].main.temp,
            weather: this.capitalizeFirstLetter(originalData[wData].weather[0].description),
            weatherId: originalData[wData].weather[0].id
          }
          arrWeather.push(dayWeather);
        }
      }else{
        if(hourData === "12:00:00"){
          dayWeather = {
            temperature: originalData[wData].main.temp,
            weather: this.capitalizeFirstLetter(originalData[wData].weather[0].description),
            weatherId: originalData[wData].weather[0].id
          }
          arrWeather.push(dayWeather);
        }
      }
    }
    var gotTodayResults = false;
    var counter = 0;
    var arrTodayResults = [];
    while(!gotTodayResults){
      var hour = (originalData[counter].dt_txt).split(" ")[1];
      switch(hour){
        case "06:00:00":
          arrTodayResults.push({name: "Morning", temperature: originalData[counter].main.temp})
          break;
        case "12:00:00":
          arrTodayResults.push({name: "Day", temperature: originalData[counter].main.temp})
          break;
        case "18:00:00":
          arrTodayResults.push({name: "Evening", temperature: originalData[counter].main.temp})
          break;
        case "00:00:00":
          arrTodayResults.push({name: "Night", temperature: originalData[counter].main.temp})
          gotTodayResults = true;
          break;
        default:
      }
      counter++;
    }
    return {arrTodayResults: arrTodayResults, results: arrWeather};
  }

  capitalizeFirstLetter(originalString){
    return originalString.charAt(0).toUpperCase() + originalString.substr(1);
  }

  backToChoose(){
    localStorage.setItem('weatherapp-lastsearch', '');
    this.setState({city: null, weather: null}); 
  }

  render() {
    if(this.state.city==null){
      return (
        <CitySearchBox chooseCity={this.chooseCity} chooseGeoPosition={this.chooseGeoPosition} ref={instance => { this.citySearchBox = instance; }}/>
      );
    }else{
      return(
        <ResultWeather city={this.state.city} objWeather={this.state.weather} backToChoose={this.backToChoose}/>
      );
    }
  }

  componentDidMount(){
    var searchHistory = localStorage.getItem('weatherapp-lastsearch');
    if(searchHistory !== null &&searchHistory !== ""){
      if(searchHistory.split(":")[0] === "city"){
        this.chooseCity(searchHistory.split(":")[1]);
      }else{
        searchHistory = searchHistory.split(":")[1];
        this.chooseGeoPosition(searchHistory.split("/")[0], searchHistory.split("/")[1]);
      }
      this.citySearchBox.showLoader();
    }
  }
}

export default App;
