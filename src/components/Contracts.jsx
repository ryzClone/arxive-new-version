import React, { useState, useEffect } from "react";
import "../style/Search.css";

import FilterImg from "../png/section/aside/white-filter.png";
import FilterClose from "../png/section/aside/whiteClose.png";
import { BASE_URL } from "./base_url";

export default function Contracts() {
    const [yearName, setYearName] = useState("");
    const [responseYear, setResponseYear] = useState([]);
    const [monthName, setMonthName] = useState("");
    const [responseMont, setResponseMonth] = useState([]);
    const [dayName, setDayName] = useState("");
    const [responseDay, setResponseDay] = useState([]);

    const [isActivate, setISactivate] = useState(false);
    const [isActiveKey, setIsActiveKey] = useState(false);
    const [files, setFiles] = useState([]);
    const [key, setKey] = useState("");

    const getAccessToken = () => {
        return localStorage.getItem("jwtToken");
    };

    const fetchData = (endpoint, params = {}) => {
        let url = `${BASE_URL}${endpoint}`;
        if (Object.keys(params).length) {
            url += "?" + new URLSearchParams(params).toString();
        }

        return fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.text().then((text) => (text ? JSON.parse(text) : {}));
            })
            .catch((error) => {
                console.error("Error occurred:", error);
                throw error;
            });
    };

    const fetchYearData = () => {
        fetchData("/service/get/year")
            .then((data) => {
                setResponseYear(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    const fetchMonthData = (selectedYear) => {
        fetchData(`/service/get/month/${selectedYear}`)
            .then((data) => {
                setResponseMonth(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    const fetchDayData = (selectedYear, selectedMonth) => {
        fetchData(`/service/get/day/${selectedYear}/${selectedMonth}`)
            .then((data) => {
                setResponseDay(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => {
        fetchYearData();
    }, []);

    const handleFormSubmites = () => {
        const data = {
            yearName,
            monthName,
            dayName,
            key,
        };

        if (isActiveKey && (yearName || monthName || dayName)) {
            setISactivate(true);

            fetch(`${BASE_URL}/service/find/contracts`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    setFiles(data);
                    setISactivate(false);
                })
                .catch((error) => {
                    console.error("Error occurred:", error);
                    setISactivate(false);
                });
        }
    };


const handleDownload = (e) => {
    // `data` obyektini dinamik ravishda to'g'rilash
    const data = {
        yearName,
        monthName,
        dayName,
        key: e === 'contracts.zip' ? key : e,
    };

    if (e === 'contracts.zip') {
        setISactivate(true);

        fetch(`${BASE_URL}/service/download/zip/contracts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${e}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setISactivate(false);
            })
            .catch((error) => {
                console.error('Xatolik yuz berdi:', error);
            });


    } else if (isActiveKey && (yearName || monthName || dayName)) {
        setISactivate(true);

        fetch(`${BASE_URL}/service/download/contracts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${e}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setISactivate(false);
            })
            .catch((error) => {
                console.error('Xatolik yuz berdi:', error);
            });
    }
};

    

    const handleChangeKey = (e) => {
        const value = e.target.value;
        setKey(value);

        // Enable the button only if the input length is 8 or more
        setIsActiveKey(value.length >= 8);
    };

    return (
        <div className="search-main">
            <div className="search-container">
                <form
                    action=""
                    className="join-group-header-body-form"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="input-body">
                        <label htmlFor="yearName" className="group-label">Year:</label>
                        <select
                            id="yearName"
                            value={yearName}
                            className="group-input"
                            onChange={(e) => {
                                const selectedYear = e.target.value;
                                setYearName(selectedYear);
                                setMonthName("");
                                setDayName("");
                                if (selectedYear) {
                                    fetchMonthData(selectedYear);
                                }
                            }}
                        >
                            <option value="">Select Year</option>
                            {responseYear?.data?.length ? (
                                responseYear.data.map((log, index) => (
                                    <option key={index} value={log}>
                                        {log}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No data available</option>
                            )}
                        </select>
                    </div>

                    <div className="input-body">
                        <label htmlFor="monthName" className="group-label">Month:</label>
                        <select
                            id="monthName"
                            value={monthName}
                            className="group-input"
                            disabled={!yearName}
                            onChange={(e) => {
                                const selectedMonth = e.target.value;
                                setMonthName(selectedMonth);
                                setDayName("");
                                if (selectedMonth) {
                                    fetchDayData(yearName, selectedMonth);
                                }
                            }}
                        >
                            <option value="">Select Month</option>
                            {responseMont?.data?.length ? (
                                responseMont.data.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No data available</option>
                            )}
                        </select>
                    </div>

                    <div className="input-body">
                        <label htmlFor="dayName" className="group-label">Day:</label>
                        <select
                            id="dayName"
                            value={dayName}
                            className="group-input"
                            disabled={!monthName}
                            onChange={(e) => setDayName(e.target.value)}
                        >
                            <option value="">Select Day</option>
                            {responseDay?.data?.length ? (
                                responseDay.data.map((day, index) => (
                                    <option key={index} value={day}>
                                        {day}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No data available</option>
                            )}
                        </select>
                    </div>

                    <div className="input-body">
                        <label htmlFor="key" className="group-label">Key:</label>
                        <input
                            type="text"
                            id="key"
                            value={key}
                            className="group-input"
                            onChange={handleChangeKey}
                        />
                    </div>

                    <div className="input-body-items">
                        <button
                            type="button"
                            style={{ border: "none" }}
                            onClick={handleFormSubmites}
                            disabled={!isActiveKey} // Disable button when `isActiveKey` is false
                        >
                            <img
                                src={FilterImg}
                                alt="Submit"
                                className="group-btn"
                                style={{ opacity: isActiveKey ? 1 : 0.5 }}
                            />
                        </button>

                        <button
                            type="button"
                            style={{ border: "none" }}
                            onClick={() => {
                                setYearName("");
                                setMonthName("");
                                setDayName("");
                                setKey("");
                                setIsActiveKey(false);
                            }}
                        >
                            <img src={FilterClose} alt="Clear" className="group-btn" />
                        </button>
                    </div>
                </form>
            </div>

            <div className="join-group-section">
                {files?.data?.length > 0 ? (
                    <table className="files-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>File Name</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody className="Table-tbody">
                        <tr className="table-tr-withPermission">
                        <td className="padding-withPermission">1</td>
                        <td>ZIP file</td>
                        <td onClick={() => handleDownload("contracts.zip")}>
                            <i className="fas fa-download"></i>
                        </td>
                        </tr>
                        {files.data.map((file, index) => (
                                <tr key={index} className="table-tr-withPermission">
                                    <td className="padding-withPermission">{index + 2}</td>
                                    <td>{file}</td>
                                    <td onClick={() => handleDownload(file)}>
                                        <i className="fas fa-download"></i>
                                    </td>
                                </tr>
                        ))}


                        </tbody>
                    </table>
                ) : (
                    <div>No data found</div>
                )}
                {isActivate && (
                    <div>
                        <div className="modalLoadaing" id="modalLoadaing"></div>
                        <div className="modal-loading-body" id="modal-loading-body">
                            <div className="spinner center">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="spinner-blade"></div>
                                ))}
                            </div>
                            <div className="spinner-title">
                                <h1>Loading</h1>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
