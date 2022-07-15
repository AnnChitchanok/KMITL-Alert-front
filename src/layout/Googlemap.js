import React, { useContext, useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { AuthContext } from "../components/Auth/Auth";

import { db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "../styles/Google.scss";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import axios from "axios";

import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";

// ตำแหน่งปัจจุบันของคุณ
const MyMark = ({ text }) => (
  <div className="marker">
    <div className="marker"></div>
    <span className="beacon"></span>
  </div>
);

// ตำแหน่งเหตุการณ์ที่พบแล้ว
const AnotherMark = (props) => {
  const { post, onClickMark } = props;
  return (
    <div className="marker-another" onClick={() => onClickMark(post)}>
      <a className="intro-banner-vdo-play-btn pinkBg" target="_blank">
        <i
          className="glyphicon glyphicon-play whiteText"
          aria-hidden="true"
        ></i>
        <span className="ripple pinkBg"></span>
        <span className="ripple pinkBg"></span>
        <span className="ripple pinkBg"></span>
      </a>
    </div>
  );
};

function Googlemap({ loadPosition, loadDialog }) {
  const { currentUser, positions } = useContext(AuthContext);

  const LAT = positions.coords.latitude;
  const LNG = positions.coords.longitude;

  const [lat, setLat] = useState(LAT);
  const [lng, setLng] = useState(LNG);

  const [data, setData] = useState();

  const getLatLng = (event) => {
    setLat(event.lat);
    setLng(event.lng);
    loadPosition(event);
  };

  const onClickMark = (TheMark) => {
    loadDialog(TheMark);
  };

  const LoadData = () => {
    axios
      .get("http://localhost:8080/api/alerts")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    LoadData();
  }, []);

  return (
    <div style={{ height: "83vh", width: "100%" }} className="pe-3 ps-3">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBD2YlPgnsg5xEvhuDUYiczcUNsOl7EmRk" }}
        defaultCenter={{ lat: LAT, lng: LNG }}
        defaultZoom={10}
        onClick={getLatLng}
        yesIWantToUseGoogleMapApiInternals
      >
        <MyMark lat={lat} lng={lng} text="ฉัน" />
        {data
          ? data.map((post, index) => (
              <AnotherMark
                key={index}
                lat={post.lat}
                lng={post.lng}
                post={post}
                onClickMark={onClickMark}
              />
            ))
          : ""}
      </GoogleMapReact>
    </div>
  );
}

export default Googlemap;
