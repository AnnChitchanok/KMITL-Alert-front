import React, { useContext, useEffect, useState } from 'react'
import GoogleMapReact from "google-map-react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from '../Auth/Auth';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import dateTransform from "../../utils/utils";
import { Redirect } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RoomIcon from '@mui/icons-material/Room';
import PushPinIcon from '@mui/icons-material/PushPin';
import CircularProgress from '@mui/material/CircularProgress';

function ViewDirection() {
    const location = useLocation();
    const [data, setData] = useState("");
    const { currentUser, positions } = useContext(AuthContext);
    console.log('positions', positions)
    const LAT = positions.coords.latitude;
    const LNG = positions.coords.longitude;
    const [alertId, setAlertId] = useState(location.pathname.split("/viewDirection/").pop());
    const [point, setPoint] = useState("");
    const [typeName, setTypeName] = useState("");
    const [userData, setUserData] = useState("");

    const loadData = () => {
        axios
            .get("http://localhost:8080/api/alert/" + alertId)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const loadType = (id) => {
        axios
            .get("http://localhost:8080/api/type/" + id)
            .then((res) => {
                setTypeName(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const loadUserData = (id) => {
        axios
            .get("http://localhost:8080/api/user/" + id)
            .then((res) => {
                console.log('/api/user/', res.data);
                setUserData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        loadData();
    }, []);

    if (!data) {
        return <CircularProgress className='progress' />
    }

    if (!typeName) {
        loadType(data.typeId);
        return <CircularProgress className='progress' />
    }

    if (!userData) {
        loadUserData(data.userId);
        return <CircularProgress className='progress' />
    }


    const apiIsLoaded = (map, maps) => {
        const google = window.google;
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        const origin = { lat: LAT, lng: LNG };
        const destination = { lat: data.lat, lng: data.lng };
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    const point = result.routes[0].legs[0];
                    directionsRenderer.setDirections(result);
                    setPoint(point);
                    // console.log('Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')');
                    // console.log('ต้นทาง >>' + point.start_address + '<< ปลายทาง >>' + point.end_address);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    };

    return (
        <div className="alert-area d-flex justify-content-between p-3">
            <div className="left d-flex">
                <div className="top">
                    <div className="profile d-flex align-items-center">
                        <div className="img border" 
                        style={{
                            backgroundImage: `url(${userData.avartar})`,
                            backgroundSize: "cover",
                            borderRadius: "100%"
                        }}>
                        </div>
                        <div className="text">
                            <div className="username">{userData.displayName}</div>
                            <div>ผู้แจ้งเหตุ</div>
                        </div>
                    </div>
                    <hr />
                    <div className="mt-3 fw-bold">
                        <div className="alert-time-area d-flex align-items-center">
                            <AddAlertIcon style={{ marginRight: "10px" }} />
                            <div className="type-message">{typeName.name}</div>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <div className="pb-3 alert-time-area d-flex align-items-center">
                            <CrisisAlertIcon style={{ marginRight: "10px" }} />
                            <div className="alert-message">{data.message}</div>
                        </div>
                    </div>
                    <div className="mt-3 text-center align-items-center">
                        <div className="pb-3 alert-time-area d-flex align-items-center">
                            <AccessTimeIcon style={{ marginRight: "10px" }} />
                            <div className="alert-time">เมื่อเวลา {data.time} นาฬิกา</div>
                        </div>
                        <div className="pb-3 alert-date-area d-flex align-items-center">
                            <DateRangeIcon style={{ marginRight: "10px" }} />
                            <div className="alert-date">{dateTransform(data?.date)}</div>
                        </div>
                    </div>
                    <div className="mt-3 d-flex align-items-center">
                        <PushPinIcon style={{ marginRight: "10px" }} />
                        <div className="location-start">{point?.start_address?.split("ประเทศไทย")}</div>
                    </div>
                    <MoreVertIcon />
                    <div className="d-flex align-items-center">
                        <RoomIcon style={{ marginRight: "10px" }} />
                        <div className="location-start">{point?.end_address?.split("ประเทศไทย")}</div>
                    </div>
                    <div className="mt-5 d-flex align-items-center">
                        <AccessTimeIcon style={{ marginRight: "10px" }} />
                        <div className="location-start">เวลาในการเดินทาง {point?.duration?.text} ({point?.distance?.text})</div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div style={{ height: "820px", width: "700px" }} className="pe-3 ps-3">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyBD2YlPgnsg5xEvhuDUYiczcUNsOl7EmRk" }}
                        center={{ lat: data.lat, lng: data.lng }}
                        defaultZoom={13}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
                    >

                    </GoogleMapReact>
                </div>
            </div>
        </div>
    )
}

export default ViewDirection;