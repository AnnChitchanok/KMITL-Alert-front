import React, { useContext, useEffect, useState } from "react";
import Reportpost from "../../layout/Reportpost";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AuthContext } from "../Auth/Auth";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import AlertDialog from "../../layout/alertDialog";
import Skeleton from '@mui/material/Skeleton';

function Report() {
    const { currentUser } = useContext(AuthContext);

    const [search, setSearch] = useState("");
    const [data, setData] = useState();
    const [searchData, setSearchData] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [dialogData, setDialogData] = useState("");

    const loadData = () => {
        axios
            .get("http://localhost:8080/api/alerts")
            .then((res) => {
                setData(res.data);
                setSearchData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const closeDialog = () => {
        setDialog(false);
    }

    const onClickPost = (e) => {
        setDialog(true);
        setDialogData(e);
    };

    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        if (search.length === 0) {
            setSearchData(data);
        } else {
            const searchedObjects = [];
            data.filter(message => {
                if (message.message.includes(search)) {
                    searchedObjects.push(message);
                }
            })
            setSearchData(searchedObjects);
        }
    }, [search])

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between pt-3 ps-5 pe-5">
                <div
                    className="input-group"
                    style={{
                        width: "60%",
                        border: "1px solid #b0d1d5",
                        borderRadius: "20px",
                        margin: "0 26px",
                        padding: "5px 10px",
                        boxShadow: "0 5px 0px #c8dadd",
                    }}
                >
                    <span
                        className="input-group-text"
                        id="basic-addon1"
                        style={{
                            border: "none",
                            background: "none",
                        }}
                    >
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="อุบัติเหตุ"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: "none",
                            background: "none",
                        }}
                    />
                </div>


                <div className="profile-name d-flex align-items-center">
                    <AccountCircleIcon style={{ marginRight: "10px" }} />
                    <div style={{ fontSize: "130%" }}>
                        {localStorage.getItem("Username")}
                    </div>
                </div>
            </div>
            <div className="post">
                {searchData ? searchData.map((post, index) => <Reportpost key={index} rpPost={post} onClickPost={onClickPost} />) : ""}
            </div>
            <Dialog open={dialog} onClose={closeDialog} fullWidth maxWidth="lg">
                <DialogContent>
                    <AlertDialog data={dialogData} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Report;
