import React, { useContext, useState } from "react";
import "../../styles/AuthenPage.scss";
import "../../styles/general.scss";
import "../../styles/Login.scss";
import TextField from "@mui/material/TextField";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { Redirect } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InputAdornment from "@mui/material/InputAdornment";
import { Email, Key, Password } from "@mui/icons-material";
import { AuthContext } from "./Auth";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setUsername] = useState("");
  const [errors, setErrors] = useState("");
  const [loggedUser, setLoggedUser] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const registered = () => {
    toast("สมัครเสร็จสิ้น");
    setTimeout(() => {
      history.push("/login");
    }, 5000);
  };

  const register = async () => {
    if (!registerUsername) {
      return setErrors("กรุณากรอกชื่อผู้ใช้");
    }
    try {
      const docData = {
        email: registerEmail,
        password: registerPassword,
        createdAt: new Date(),
        displayName: registerUsername,
        avartar: "public/img/avatar.png",
        status: "",
        alerts: 0,
      };

      // create user
      axios
        .post("http://localhost:4050/api/auth/signup", docData)
        .then((res) => {
          console.log(res.data);
          registered();
        })
        .catch((err) => {
          console.log(err);
        });

      // set login check
      setLoggedUser(true);
    } catch (error) {
      findFormErrors(error.code.toString());
    }
  };

  const findFormErrors = (code) => {
    console.log(code);
    if (code === "auth/missing-email") return setErrors("กรุณากรอกอีเมล์");
    if (code === "auth/email-already-in-use")
      return setErrors("ผิดพลาด! กรุณากรอกอีเมล์ให้ถูกต้องเพื่อเข้าสู่ระบบ");
    if (code === "auth/internal-error")
      return setErrors("ผิดพลาด! กรุณากรอกข้อมูลให้ครบถ้วน");
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <ToastContainer position="top-center" />
      <div className="bg-orange row justify-content-around text-center align-items-center">
        <div className="col-md-6">
          <div className="logo">
            <img src="/img/logo.png" style={{ width: "50%" }} />
          </div>
          <div className="color-white" style={{ marginTop: "30px" }}>
            King Mongkut's Initute of Technology Ladkrbang.
          </div>
        </div>
        <div className="col-md-6">
          <div className="forms">
            <div className="forms-title mb-3">Create Account</div>
            {errors && <div className="error-message mt-3 mb-3">{errors}</div>}
            <div className="input">
              <TextField
                fullWidth
                id="standard-basic"
                label="Full name"
                type="text"
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                name="username"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </div>
            <div className="input">
              <TextField
                fullWidth
                id="standard-basic"
                label="Email"
                type="text"
                variant="standard"
                name="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  setRegisterEmail(event.target.value);
                }}
              />
            </div>
            <div className="input mb-3">
              <TextField
                fullWidth
                id="standard-basic"
                label="Password"
                variant="standard"
                type="password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Key />
                    </InputAdornment>
                  ),
                }}
                name="password"
                onChange={(event) => {
                  setRegisterPassword(event.target.value);
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg container-fluid"
              onClick={register}
            >
              Create an account
            </button>
            <div style={{ marginTop: "10px" }}>
              Already have an account? <a href="/login">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
