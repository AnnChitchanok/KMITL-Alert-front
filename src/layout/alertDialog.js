import React, { useContext, useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import GoogleMapReact from "google-map-react";
import "../styles/Google.scss";
import axios from "axios";
import dateTransform from "../utils/utils";
import { AuthContext } from "../components/Auth/Auth";
import { useHistory } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

const AnotherMark = (props) => {
  const { post } = props;
  return (
    <div className="marker-another">
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

const AlertDialog = (props) => {
  const { data } = props;
  const [typeName, setTypeName] = useState("");
  const [userData, setUserData] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const loadType = () => {
    axios
      .get("http://localhost:8080/api/type/" + data.typeId)
      .then((res) => {
        setTypeName(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const loadAvatar = () => {
    axios
      .get("http://localhost:8080/api/user/" + data.userId)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    loadType();
    loadAvatar();
    setTimeout(() => {
      setLoading(true);
    }, 700)
  }, []);

  const goToViewDirection = (id) => {
    history.push("/viewDirection/" + id);
  }

  return (
    <div className="alert-area d-flex justify-content-between p-3" style={{ width: "100%", height: "700px" }}>
      <div className="left d-flex" style={{ width: "50%", marginRight: "50px" }}>
        <div className="top">
          <div className="profile d-flex align-items-center">
            {loading ? (
              <div>
                <div className="img border"
                  style={{
                    backgroundImage: `url(${userData.avartar})`,
                    backgroundSize: "cover",
                    borderRadius: "100%"
                  }}>
                </div>
              </div>
            ) : (
              <Skeleton animation="wave" variant="circular" width={100} height={100} />
            )}
            {/* <div
              className="profile-img d-flex align-items-center border"
              style={{
                backgroundImage: `url(${userData.avartar})`,
              }}
            ></div> */}
            {loading ? (
              <div className="text">
                <div className="username">{userData.displayName}</div>
                <div>ผู้แจ้งเหตุ</div>
              </div>
            ) : (
              <div>
                <Skeleton variant="text" animation="wave" height={30} width={200} style={{ marginLeft: "20px" }} />
                <Skeleton variant="text" animation="wave" height={20} width={150} style={{ marginLeft: "20px" }} />
              </div>
            )}
          </div>
          <hr />
          {loading ? (
            <>
              <div className="mt-4 text-center">
                <div className="pb-3 alert-time-area d-flex align-items-center">
                  <CrisisAlertIcon style={{ marginRight: "10px" }} />
                  <div className="alert-message">{data.message}</div>
                </div>
              </div>
              <div className="mt-3 text-center align-items-center justify-content-around">
                <div className="pb-3 alert-time-area d-flex align-items-center">
                  <AccessTimeIcon style={{ marginRight: "10px" }} />
                  <div className="alert-time">เมื่อเวลา {data.time} นาฬิกา</div>
                </div>
                <div className="pb-3 alert-date-area d-flex align-items-center">
                  <DateRangeIcon style={{ marginRight: "10px" }} />
                  <div className="alert-date">{dateTransform(data.date)}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Skeleton variant="text" animation="wave" height={20} width={150} style={{ marginTop: "1.5rem" }} />
              <Skeleton variant="text" animation="wave" height={20} width={200} style={{ marginTop: "3rem" }} />
              <Skeleton variant="text" animation="wave" height={20} width={250} style={{ marginTop: "1rem" }} />
            </>
          )}
        </div>
        <div className="direction-button pt-3 pb-3">
          <button
            type="button"
            className="btn btn-primary container-fluid pt-3 pb-3"
            onClick={() => goToViewDirection(data.id)}
          >
            นำทางไปยังจุดเกิดเหตุ
          </button>
        </div>
      </div>
      <div className="right" style={{ width: "100%" }}>
        <div style={{ height: "100%", width: "100%" }} className="pe-3 ps-3">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyBD2YlPgnsg5xEvhuDUYiczcUNsOl7EmRk"
            }}
            defaultCenter={{ lat: data.lat, lng: data.lng }}
            defaultZoom={18}
            yesIWantToUseGoogleMapApiInternals
          >
            <AnotherMark post={data} lat={data.lat} lng={data.lng} />
          </GoogleMapReact>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
