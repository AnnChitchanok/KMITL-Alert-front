import React, { useState, useEffect, useContext } from "react";
import "../styles/Sidebar.scss";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import socketIOClient from "socket.io-client";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/Auth/Auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

function Navbar() {
  const history = useHistory();
  const location = useLocation();

  const [alertLink, setAlertLink] = useState(true);
  const [reportLink, setReportLink] = useState(false);
  const [messageLink, setMessageLink] = useState(false);
  const [profileLink, setProfileLink] = useState(false);

  const [accident, setAccident] = useState(true);
  const [crime, setCrime] = useState(false);

  // realtimeDataBase
  const [alerts, setAlers] = useState();
  const { currentUser } = useContext(AuthContext);
  const [total_notify, setTotal] = useState(0);
  const [dataUsers, setDataUsers] = useState();

  function gotoAlertLink() {
    setAlertLink(true);
    setReportLink(false);
    setMessageLink(false);
    setProfileLink(false);
    history.push("/");
  }

  function gotoReportLink() {
    setReportLink(true);
    setAlertLink(false);
    setMessageLink(false);
    setProfileLink(false);
    setAccident(true);
    setCrime(false);
    history.push("/accident");
    updateAlerts();
  }

  function gotoMessageLink() {
    setMessageLink(true);
    setReportLink(false);
    setAlertLink(false);
    setProfileLink(false);
    history.push("/message");
  }

  function gotoProfileLink() {
    setMessageLink(false);
    setReportLink(false);
    setAlertLink(false);
    setProfileLink(true);
    history.push("/profile");
  }

  function gotoAccident() {
    setAccident(true);
    setCrime(false);
    history.push("/accident");
  }
  function gotoCrime() {
    setAccident(false);
    setCrime(true);
    history.replace("/crime");
  }

  const loadNotify = () => {
    axios
      .get("http://localhost:8080/api/alerts/")
      .then(async (res) => {
        onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          setTotal(res.data.length - doc.data().alerts);
        });
        setAlers(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateAlerts = () => {
    const data = {
      alerts: alerts,
    };
    axios
      .put("http://localhost:8080/api/user/" + currentUser.uid, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadNotify();
  }, []);

  return (
    <div className="sidebar">
      <div className="logo pb-5 pt-5 text-center">
        <img src="/img/logo.png" style={{ width: "60%" }} />
      </div>
      <ul>
        <li className={alertLink ? "radius-top" : ""}>
          <a></a>
        </li>
        <li
          onClick={() => gotoAlertLink()}
          className={alertLink ? "active" : ""}
        >
          <a>
            <NotificationsNoneIcon />
            แจ้งเหตุ
          </a>
        </li>
        <li className={reportLink ? "active" : ""}>
          <a onClick={() => gotoReportLink()}>
            {" "}
            <BarChartIcon />
            รายงาน
            {total_notify ? (
              <span className="badge-alert">{total_notify}</span>
            ) : (
              ""
            )}
          </a>
        </li>
        <li
          onClick={() => gotoProfileLink()}
          className={profileLink ? "active" : ""}
        >
          <a>
            <SettingsIcon />
            โปรไฟล์
          </a>
        </li>
        <li>
          <a></a>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
