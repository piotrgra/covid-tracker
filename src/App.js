import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState(useState([]));
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [yesterdayData, setYesterdayData] = useState({});

  const getYesterdayData = async (countryCode = "worldwide") => {
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all?yesterday=true&strict=true"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true&strict=true`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setYesterdayData(data);
      });
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((respons) => respons.json())
      .then((data) => {
        setCountryInfo(data);
      });
    getYesterdayData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((respons) => respons.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });

    getYesterdayData(countryCode === "worldwide" ? "worldwide" : countryCode);
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Cały świat</MenuItem>
              {countries.map((country, i) => (
                <MenuItem key={i} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Zachorowania"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            updated={countryInfo.updated}
            countryInfo={countryInfo}
            yesterdayData={prettyPrintStat(yesterdayData.todayCases)}
            perMilion={prettyPrintStat(countryInfo.activePerOneMillion)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Wyleczonych"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            updated={countryInfo.updated}
            countryInfo={countryInfo}
            yesterdayData={prettyPrintStat(yesterdayData.todayRecovered)}
            perMilion={prettyPrintStat(countryInfo.recoveredPerOneMillion)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Zmarło"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            updated={countryInfo.updated}
            countryInfo={countryInfo}
            yesterdayData={prettyPrintStat(yesterdayData.todayDeaths)}
            perMilion={prettyPrintStat(countryInfo.deathsPerOneMillion)}
          />
        </div>
        <Card className="infoBox__more">
          {console.log(countryInfo)}
          <h1>
            Szczegóły dla{" "}
            {countryInfo.country ? countryInfo.country : "Cały świat"}
          </h1>
          <table class="infoBox__more--table">
            <tr>
              <td>Aktywnych przypadków:</td>
              <td>{prettyPrintStat(countryInfo.active)}</td>
              <td>Aktywnych przypadków na milion:</td>
              <td>{prettyPrintStat(countryInfo.activePerOneMillion)}</td>
            </tr>
            <tr>
              <td>Przypadków ogólnie:</td>
              <td>{prettyPrintStat(countryInfo.cases)}</td>
              <td>Przypadków ogólnie na milion:</td>
              <td>{prettyPrintStat(countryInfo.casesPerOneMillion)}</td>
            </tr>
            <tr>
              <td>Zmarło:</td>
              <td>{prettyPrintStat(countryInfo.deaths)}</td>
              <td>Zmarło na milion:</td>
              <td>{prettyPrintStat(countryInfo.deathsPerOneMillion)}</td>
            </tr>
            <tr>
              <td>Wyzdrowiało:</td>
              <td>{prettyPrintStat(countryInfo.recovered)}</td>
              <td>Wyzdrowiało: na milion:</td>
              <td>{prettyPrintStat(countryInfo.recoveredPerOneMillion)}</td>
            </tr>
            <tr>
              <td>Przeprowadzono testów:</td>
              <td>{prettyPrintStat(countryInfo.tests)}</td>
              <td>Przeprowadzono testów na milion:</td>
              <td>{prettyPrintStat(countryInfo.testsPerOneMillion)}</td>
            </tr>
          </table>
        </Card>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Zachorowania cały świat</h3>
          <Table countries={tableData} />
          <h3 className="app_graphTitle">Cały świat: {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
