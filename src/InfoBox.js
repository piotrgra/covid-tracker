import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({
  countryInfo,
  title,
  cases,
  isRed,
  active,
  perMilion,
  total,
  updated,
  yesterdayData,
  ...props
}) {
  let date = new Date(updated).toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
  });
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title} (dla{" "}
          {countryInfo.country ? countryInfo.country : "Cały świat"})
        </Typography>

        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          <Typography className="infoBox__total" color="textSecondary">
            dziś / wczoraj:
          </Typography>
          {cases} / {yesterdayData}
        </h2>
        {perMilion ? (
          <Typography className="infoBox__total" color="textSecondary">
            {perMilion} na milion
          </Typography>
        ) : (
          ""
        )}
        <Typography className="infoBox__total" color="textSecondary">
          {total} suma
        </Typography>
        <h4 className="infoBox__updated">Ostatnia akutalizacja: {date}</h4>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
