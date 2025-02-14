import React, { useState } from "react";
import "../style/Search.css"

import FilterImg from "../png/section/aside/white-filter.png";
import FilterClose from "../png/section/aside/whiteClose.png";
import { BASE_URL } from "./base_url";

export default function Search() {
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [key, setKey] = useState('');

    const [isActivate, setISactivate] = useState(false);


    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    const handleFormSubmites = () => {
        const Demo = document.getElementById('demo');
        Demo.innerHTML = " ";
        
        const data = {
            keyword: key,
            service: service,
            date: date,
        }

        setISactivate(true);
        fetch(`${BASE_URL}/search/text`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                Viewdata(data);
                setISactivate(false);
            })
            .catch((error) => {
                console.error("Xatolik yuz berdi:", error);
                setISactivate(false);
                Demo.style.color = "red";
            Demo.innerHTML = error;
            });
    }

    const Viewdata = (data) => {
        const Demo = document.getElementById('demo');
        Demo.innerHTML = " ";

        if (data.data === null) {
            Demo.style.color = "red";
            Demo.innerHTML = data.message;
        } else {
            Demo.style.color = "#000";
            data.data.forEach(element => {
                const span = document.createElement('p');
                span.innerHTML = element;

                Demo.appendChild(span);
            });
        }
    }

    const getAccessToken = () => {
        return localStorage.getItem("jwtToken");
    };

    const handleFormClear = () => {
        setService('');
        setDate('');
        setKey('');
    }

    const isActivateModal = () => {
        if (isActivate) {
            return (
                <div>
                    <div className="modalLoadaing" id="modalLoadaing"></div>

                    <div className="modal-loading-body" id="modal-loading-body">
                        <div className="spinner center">
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                        </div>

                        <div className="spinner-title">
                            <h1>Loading</h1>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div className="search-main">
            <div className="search-container">
                <form action="" className="join-group-header-body-form" onClick={handleFormSubmit}>

                    <div className="input-body">
                        <label htmlFor="" className="group-label">Service: </label>
                        <input type="text" name="name" value={service} className="group-input" onChange={(e) => setService(e.target.value)} />
                    </div>

                    <div className="input-body">
                        <label htmlFor="" className="group-label">Date:</label>
                        <input type="text" name="name" value={date} className="group-input" onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="input-body">
                        <label htmlFor="" className="group-label">Key: </label>
                        <input type="text" name="name" value={key} className="group-input" onChange={(e) => setKey(e.target.value)} />
                    </div>

                    <div className="input-body-items">

                        <button type="submit" style={{ border: "none" }} onClick={handleFormSubmites}>
                            <img src={FilterImg} alt="Submit" className="group-btn" />
                        </button>

                        <button type="submit" style={{ border: "none" }} onClick={handleFormClear}>
                            <img src={FilterClose} alt="Submit" className="group-close" />
                        </button>

                    </div>


                </form>

                <div>
                    <div>Logs</div>
                    <div><hr /></div>
                    <div id="demo"></div>
                </div>

                {isActivateModal()}
            </div>
        </div>
    )
}