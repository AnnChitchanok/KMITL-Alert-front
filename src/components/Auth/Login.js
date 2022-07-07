import React, { useContext, useState } from "react";
import "../../styles/Login.scss";
import "../../styles/general.scss";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import { Email, Key, Password } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "./Auth";

function Login() {
  const history = useHistory();

  const { currentUser } = useContext(AuthContext);

  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState(false);
  const [errors, setErrors] = useState("");
  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setLoggedUser(true);
    } catch (error) {
      findFormErrors(error.code.toString());
    }
  };

  const findFormErrors = (code) => {
    console.log(code);
    if (code === "auth/wrong-password")
      return setErrors("ผิดพลาด! รหัสผ่านไม่ถูกต้อง");
    if (code === "auth/invalid-email")
      return setErrors("ผิดพลาด! กรุณากรอกอีเมล์ให้ถุกต้องเพื่อเข้าสู่ระบบ");
    if (code === "auth/internal-error")
      return setErrors("ผิดพลาด! กรุณากรอกข้อมูลให้ครบถ้วน");
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (loggedUser) {
    return <Redirect to="/" />;
  }

  const SignUp = () => {
    history.push("/register");
  }

  const ForgotPassword = () => {
    history.push("/forgot_password");
  }

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
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
            <div className="forms-title mb-3">Account Login</div>
            {errors && <div className="error-message mt-3 mb-3">{errors}</div>}
            <div className="input">
              <TextField
                fullWidth
                id="standard-basic"
                label="Email Address"
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  setloginEmail(event.target.value);
                  setErrors("");
                }}
              />
            </div>
            <div className="input">
              <TextField
                fullWidth
                id="standard-basic"
                label="Password"
                variant="standard"
                type={values.showPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Key />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  setloginPassword(event.target.value);
                  setErrors("");
                }}
              />
            </div>
             <div className="forget-password mb-3" onClick={ForgotPassword}>
              <a href="#">Forgot password?</a> 
            </div> 
            <button
              type="button"
              className="btn btn-primary container-fluid"
              onClick={login}
            >
              เข้าสู่ระบบ
            </button>
            <div className="register mb-3 mt-3 fs-7" onClick={SignUp}>
              Not a member? <a href="">Signup now.</a>
            </div>
            <br/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
