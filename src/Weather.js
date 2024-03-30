import React, { useState, useEffect } from "react";
import dfs_xy_conv from "./xyGrid";

const API_KEY = process.env.REACT_APP_API_KEY;

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const url =
        "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
      const authKey = API_KEY;

      // time set
      const today = new Date();
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);
      const dateString = year + month + day;

      console.log(dateString);
      //get a current geo values
      navigator.geolocation.getCurrentPosition(async (position) => {
        //get current lati, long values
        const lati = position.coords.latitude;
        const long = position.coords.longitude;

        //convert to match lati and long values in weather KMA api location values
        const xy = dfs_xy_conv("toXY", parseFloat(lati), parseFloat(long));
        const xx = `${xy.x}`;
        const yy = `${xy.y}`;
        const reqURL = `${url}?serviceKey=${authKey}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${dateString}&base_time=0630&nx=${xx}&ny=${yy}`;
        console.log(reqURL);

        try {
          const response = await fetch(reqURL);
          const data = await response.json();
          console.log(data);
          setWeatherData(data);
        } catch (error) {
          console.error("error msg,,", error);
        }
      });
    };

    fetchWeatherData();
  }, []);

  return (
    <div>
      <h1>Weather</h1>
      {weatherData ? (
        <div>
          {weatherData.response.body.items.item.map((i, idx) => {
            return <p key={idx}>{i.baseDate}</p>;
          })}{" "}
        </div>
      ) : (
        <p>waittttt</p>
      )}
    </div>
  );
};

export default Weather;
