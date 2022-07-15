import React, { useContext, useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../../styles/Profile.scss";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import EmailIcon from "@mui/icons-material/Email";
import ShareIcon from "@mui/icons-material/Share";
import { AuthContext } from "../Auth/Auth";
import { signOut } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import LogoutIcon from "@mui/icons-material/Logout";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Redirect } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import axios from "axios";
import LockIcon from "@mui/icons-material/Lock";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "@mui/material/Skeleton";
import { sendPasswordResetEmail } from "firebase/auth";

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState();
  const [userLogout, setUserLogout] = useState(false);
  const [image, setImage] = useState("");
  const [changeNameDialog, setChangeNameDialog] = useState(false);
  const [changePassDialog, setChangePassDialog] = useState(false);

  const [updateName, setUpdateName] = useState("");

  const [loading, setLoading] = useState(false);

  const sendEmail = () => {
    toast(
      "เราได้ส่งลิงค์เว็บไซด์ในการรีเซ็ตไปที่ Email ของคุณแล้วโปรดเช็คที่ Email ของคุณ"
    );
    setTimeout(() => {
      logout();
    }, 5000);
  };

  const notify = () => {
    toast("เปลี่ยนชื่อสำเร็จ");
    setTimeout(() => {
      loadData(currentUser.uid);
    }, 3000);
  };
  const notifyAvartar = () => {
    toast("อัปโหลดรูปภาพสำเร็จ");
    setTimeout(() => {
      loadData(currentUser.uid);
    }, 3000);
  };
  const alert = () => toast("ขนาดไฟล์ต้องไม่เกิน 5 MB");
  const loadData = (id) => {
    axios
      .get("http://localhost:4050/api/user/" + id)
      .then((res) => {
        setUser(res.data);
        // console.log(currentUser);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUserData = (data) => {
    axios
      .put("http://localhost:4050/api/user/" + currentUser.uid, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadData(currentUser.uid);
    setTimeout(() => {
      setLoading(true);
    }, 700);
  }, []);

  const Storage = getStorage();
  const handleFile = async (event) => {
    const file = event.target.files[0];
    // console.log(file.size);

    const maxSize = 5000;
    if (file.size > maxSize * 1024) {
      alert();
      return;
    }
    const base64 = convertBase64(file);
    const storageRef = ref(Storage, `image/${file.name}`);
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  //read
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
        const docData = {
          avartar: fileReader.result,
        };
        updateDoc(doc(db, "users", currentUser.uid), docData);
        notifyAvartar();
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const changeName = () => {
    setChangeNameDialog(true);
  };

  const changePassword = () => {
    setChangePassDialog(true);
  };

  const closeDialog = () => {
    setChangeNameDialog(false);
  };

  const closePassDialog = () => {
    setChangePassDialog(false);
  };

  const handleChangeName = (e) => {
    setUpdateName(e.target.value);
  };

  const handleSubmit = () => {
    const docData = {
      displayName: updateName,
    };
    // updateDoc(doc(db, "users", currentUser.uid), docData);
    updateUserData(docData);
    setChangeNameDialog(false);
    notify();
    loadData(currentUser.uid);
  };

  const ForgotPassword = () => {
    sendPasswordResetEmail(auth, currentUser.email)
      .then(() => {
        sendEmail();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const logout = async () => {
    setUserLogout(true);
    await signOut(auth);
    localStorage.clear();
    console.log("SignOut : success");
  };

  if (userLogout) {
    return <Redirect to="/login" />;
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="profile-setting">
      <ToastContainer position="top-center" />
      <Dialog
        open={changeNameDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>เปลี่ยนชื่อ</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <div className="input p-3">
            <TextField
              id="standard-basic"
              label="เปลี่ยนชื่อ"
              variant="standard"
              type="text"
              value={updateName}
              onChange={handleChangeName}
              style={{ width: "230px" }}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary mt-4 container-fluid"
            onClick={handleSubmit}
          >
            เปลี่ยนชื่อ
          </button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={changePassDialog}
        onClose={closePassDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <div className="register fs-7 ms-2">
            <div>
              คุณอาจจะต้องได้เข้าสู่ระบบใหม่
              <br />
              หลังจากที่กดรีเซ็ตรหัสผ่าน
            </div>
            <div className="forgot-btn" onClick={ForgotPassword}>
              Forgot your password?
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div className="d-flex align-items-center">
          <label className="profile-display">
            <div
              className="profile-img d-flex align-items-center"
              style={{
                backgroundImage: `url(${user?.avartar})`,
              }}
            ></div>
            <input type="file" onChange={handleFile} />
            <div className="edit-profile-img">
              <ModeEditIcon />
            </div>
          </label>
          <div className="row profile-name align-items-center">
            <div className="col-md-2">
              <AccountCircleIcon style={{ fontSize: "30pt" }} />
            </div>
            <div className="col-md-10">
              <div className="display-name">{user?.displayName}</div>
              <div className="activity-time">
                Last seen:{" "}
                <ReactTimeAgo
                  date={currentUser.metadata.lastSignInTime}
                  locale="en-US"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={150}
            height={150}
            style={{ borderRadius: "25px" }}
          />
          <div>
            <Skeleton
              variant="text"
              animation="wave"
              height={40}
              width={200}
              style={{ marginLeft: "20px" }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              height={20}
              width={200}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>
      )}
      {loading ? (
        <div className="mt-5">
          <div className="btn d-flex align-items-center" onClick={changeName}>
            <div className="icon">
              <ModeEditIcon style={{ marginRight: "10px" }} />
            </div>
            <div className="text">{user?.displayName}</div>
          </div>
          <div
            className="btn d-flex align-items-center"
            onClick={changePassword}
          >
            <div className="icon">
              <LockIcon style={{ marginRight: "10px" }} />
            </div>
            <div className="text">เปลี่ยนรหัสผ่าน</div>
          </div>
          <div className="btn d-flex align-items-center">
            <div className="icon">
              {" "}
              <EmailIcon style={{ marginRight: "10px" }} />
            </div>
            <div className="text">{user?.email}</div>
          </div>
          <div className="btn d-flex align-items-center">
            <div className="icon">
              <MoreHorizIcon style={{ marginRight: "10px" }} />
            </div>
            <div className="text">
              {user?.status ? user?.status : "ยังไม่มีสถานะ"}
            </div>
          </div>
          <div className="btn d-flex align-items-center">
            <div className="icon">
              <QuestionMarkIcon style={{ marginRight: "10px" }} />
            </div>
            <div className="text">Help</div>
          </div>
          <div className="btn d-flex align-items-center">
            <div className="icon">
              <ShareIcon style={{ marginRight: "10px" }} />
            </div>
            <div className="text">Invite</div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "5rem" }}>
          <Skeleton variant="text" animation="wave" height={30} width={200} />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            width={200}
            style={{ marginTop: "20px" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            width={430}
            style={{ marginTop: "20px" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            width={230}
            style={{ marginTop: "20px" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            width={330}
            style={{ marginTop: "20px" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            width={200}
            style={{ marginTop: "20px" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            height={30}
            width={200}
            style={{ marginTop: "20px" }}
          />
        </div>
      )}
      <div className="btn-logout text-center" onClick={logout}>
        Logout
      </div>
    </div>
  );
}

export default Profile;
