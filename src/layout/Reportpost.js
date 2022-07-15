import React, { useEffect, useState } from "react";
import "../styles/ReportPost.scss";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";

function Reportpost(props) {
  const { rpPost, onClickPost } = props;
  const [userData, setUserData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    axios
      .get("http://localhost:4050/api/user/" + rpPost.userId)
      .then((res) => {
        setUserData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(() => {
      setLoading(true);
    }, 700);
  }, [rpPost]);
  return (
    <div className="report-post" onClick={() => onClickPost(rpPost)}>
      <div className="d-flex align-items-center">
        <div className="report-profile">
          {loading ? (
            <div
              className="profile-img d-flex align-items-center"
              style={{
                backgroundImage: `url(${userData.avartar})`,
                backgroundSize: "cover",
                height: "100%",
              }}
            ></div>
          ) : (
            <Skeleton
              animation="wave"
              variant="circular"
              width={60}
              height={60}
            />
          )}
        </div>
        {loading ? (
          <div className="text-area">
            <div className="name">{userData.displayName}</div>
            <div className="report-message">{rpPost.message}</div>
          </div>
        ) : (
          <div>
            <Skeleton variant="text" animation="wave" height={30} width={200} />
            <Skeleton variant="text" animation="wave" height={20} width={100} />
          </div>
        )}
      </div>
      <div className="d-flex align-items-center dates mt-3">
        {loading ? (
          <>
            <div className="time-area d-flex align-items-center">
              <AccessTimeIcon />
              <div className="time ms-1">{rpPost.time} น</div>
            </div>
            <div className="date-area d-flex align-items-center">
              <DateRangeIcon />
              <div className="date ms-1">{rpPost.date}</div>
            </div>
            <BarChartIcon style={{ marginLeft: "3rem" }} />
          </>
        ) : (
          <>
            <Skeleton variant="text" animation="wave" height={20} width={150} />
            <Skeleton
              variant="text"
              animation="wave"
              height={20}
              width={150}
              style={{ marginLeft: "25px" }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Reportpost;
