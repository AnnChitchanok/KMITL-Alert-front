import React, { useContext, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import DatePicker from "@mui/lab/DatePicker";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Googlemap from "../../layout/Googlemap";
import { AuthContext } from "../Auth/Auth";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../../styles/Notify.scss";

import AlertDialog from "../../layout/alertDialog";

const RadioList = (props) => {
  const { data } = props;
  return (
    <div className="form-check ms-3">
      <input
        className="form-check-input"
        type="radio"
        name="flexRadioDefault"
        id="flexRadioDefault1"
        value={data.id}
      />
      <label className="form-check-label">{data.name}</label>
    </div>
  );
};

function Notify() {
  const { currentUser, positions } = useContext(AuthContext);

  const [report, setReport] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState("");
  const [dialog, setDialog] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dialogData, setDialogData] = useState();
  const [alert, setAlert] = useState(false);

  const [dataType, setDataType] = useState();
  const notify = () => toast("บันทึกข้อมูลสำเร็จ กรุณาเช็คที่หน้ารายงาน");

  const loadRadioData = () => {
    axios
      .get("http://localhost:4050/api/types")
      .then((res) => {
        setDataType(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadAvartar = () => {
    axios
      .get("http://localhost:4050/api/user/" + currentUser?.uid)
      .then((res) => {
        setImage(res.data.avartar);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    loadAvartar();
    //loadRadioData();
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const handleOnChangeReport = (e) => {
    setReport(e.target.value);
  };

  const handleOnChangeType = (e) => {
    setType(e.target.value);
  };

  const closeDialog = () => {
    setDialog(false);
  };

  // หน้ารายงาน
  const getPosition = (e) => {
    setDialog(true);
    setLat(e.lat);
    setLng(e.lng);
  };

  // ดึงข้อมูลมาจาก GoogleMap.js
  const getDialog = (e) => {
    setDialogData(e);
    setAlert(true);
  };

  const closeDialogData = () => {
    setAlert(false);
  };

  const addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  const createReport = () => {
    // ใส่ชื่อ field และ ใส่ค่า ให้ตรงกับ models
    const data = {
      userId: currentUser.uid, //userid
      message: report, //report "เก็บข้อความ"
      //typeId: type, //type เก็บเป็นไอดี
      time: addZero(time.getHours()) + ":" + addZero(time.getMinutes()), //เวลา
      date: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(), // วันที่
      lat: lat,
      lng: lng,
      status: false,
      createdAt: new Date(),
    };

    axios
      .post("http://localhost:4050/api/alert", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setDialog(false);
    notify();
    window.location.reload(false);
  };

  return (
    <div className="notify-area">
      <ToastContainer position="top-center" />
      <div className="google-map text-center mt-3 mb-3">
        <Googlemap loadPosition={getPosition} loadDialog={getDialog} />
      </div>
      <Dialog open={dialog} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogContent style={{ width: "600px" }}>
          <div className="profile-area text-center">
            <div
              className="profile-img d-flex align-items-center"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
              }}
            ></div>
            <div className="name mt-3" style={{ fontSize: "130%" }}>
              {localStorage.getItem("Username")}
            </div>
            <div className="mt-3">
              <div className="input">
                <TextField
                  id="standard-basic"
                  label="รายงาน"
                  variant="standard"
                  type="text"
                  value={report}
                  onChange={handleOnChangeReport}
                  style={{ width: "230px" }}
                />
              </div>
            </div>
            <div className="mt-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  fullWidth
                  label="เลือกเวลา"
                  value={time}
                  onChange={(e) => {
                    setTime(e);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className="mt-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="เลือกวันที่"
                  value={date}
                  onChange={(e) => {
                    setDate(e);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="button-area">
              <button
                type="button"
                className="btn btn-primary mt-4 container-fluid"
                onClick={createReport}
              >
                แจ้งเหตุ
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={alert} onClose={closeDialogData} fullWidth maxWidth="lg">
        <DialogContent>
          <AlertDialog data={dialogData} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Notify;
