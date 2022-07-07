import React, { useContext, useState } from 'react'
import "../../styles/Login.scss";
import "../../styles/general.scss";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Redirect, useHistory } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import { Email } from "@mui/icons-material";
import { AuthContext } from "./Auth";
import { auth } from "../../services/firebase";
import { ToastContainer, toast } from "react-toastify";

function ForgotPassword() {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [errors , setErrors] = useState();

  const sendEmail = () => {
    toast("เราได้ส่งลิงค์เว็บไซด์ในการรีเซ็ตไปที่ Email ของคุณแล้วโปรดเช็คที่ Email ของคุณ");
    setTimeout(() => {
      history.push("/login");
    }, 5000);
  };

  const resetSubmit = () => {
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          sendEmail();
        })
        .catch((err) => {
          // console.log(err.message);
          findFormErrors(err.code.toString())
        })
    } else {
      setErrors("โปรดกรอกอีเมล์!");
    }
  }

  const findFormErrors = (code) => {
    // console.log(code);
    if (code === "auth/user-not-found")
      return setErrors("ไม่พบอีเมล์ที่ระบุ! โปรดกรอกอีเมล์ให้ถูกต้อง");
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container">
      <ToastContainer position="top-center" />
      <div className="bg-orange row justify-content-around text-center align-items-center ps-3 pe-3">
        <div className="col-md-6">
          <div className="logo">
            <img src="/img/logo.png" style={{ width: "50%" }} />
          </div>
          <div className="color-white" style={{ marginTop: "30px" }}>
            King Mongkut's Initute of Technology Ladkrabang.
          </div>
        </div>
        <div className="col-md-6">
          <div className="forms">
            <div className="forms-title mb-3">Forgot Your Password ?</div>
            {errors && <div className="error-message mt-3 mb-3">{errors}</div>}
            <div className="input">
              <TextField
                fullWidth
                id="standard-basic"
                label="Email Address"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary container-fluid mt-3"
              onClick={resetSubmit}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;