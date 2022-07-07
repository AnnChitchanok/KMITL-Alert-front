import React, { useContext } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

import "../../styles/Message.scss";
import MicIcon from "@mui/icons-material/Mic";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AuthContext } from "../Auth/Auth";
import { Redirect } from "react-router-dom";

function Message() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between pt-3 ps-5 pe-5">
        <div className="input-group" style={{ width: "500px" }}>
          <span className="input-group-text" id="basic-addon1">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        {/* <div className="profile-name d-flex align-items-center">
                    <AccountCircleIcon style={{ marginRight: "10px" }} />
                    <div style={{ fontSize: "130%" }}>{localStorage.getItem('Username')}</div>
                </div> */}
      </div>
      <div className="d-flex justify-content-between ms-5 me-5">
        <div className="recent-chat mt-5">
          <div className="chat d-flex align-items-center active">
            <div className="profile">
              <img
                src="https://cdn.discordapp.com/attachments/930009066007314432/954098057203556422/de897f09e5c22e6b78b08c410bc59d9b.png"
                alt=""
              />
            </div>
            <div className="ms-3">
              <div className="name">gugukaka</div>
              <div className="pv-message">5555555</div>
              <div className="date">today.</div>
            </div>
          </div>
        </div>
        <div className="chat-area mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="user d-flex align-items-center">
              <div className="profile">
                <img
                  src="https://cdn.discordapp.com/attachments/930009066007314432/954098057203556422/de897f09e5c22e6b78b08c410bc59d9b.png"
                  alt=""
                />
              </div>
              <div className="ms-3">
                <div className="name">gugukaka</div>
                <div className="status">Online</div>
              </div>
            </div>
            <div className="icons">
              <LocalPhoneIcon style={{ marginRight: "20px" }} />
              <VideocamIcon style={{ marginRight: "20px" }} />
              <MoreVertIcon />
            </div>
          </div>
          <hr />

          <div className="friend-area">
            <div className="friend-text">เธอๆ</div>
            <div className="details mt-1">
              Today <br />
              14:30 น
            </div>
          </div>
          <div className="my-area">
            <div className="my-text mt-3">test</div>
            <div className="details mt-1">
              Today <br />
              14:35 น
            </div>
          </div>
          <div className="bottom">
            <hr />
            <div className="d-flex align-items-center">
              <div className="input-group" style={{ width: "450px" }}>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>
              <div className="mic ms-3">
                <MicIcon style={{ color: "white" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
