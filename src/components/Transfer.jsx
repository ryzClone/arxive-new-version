import React, { Component } from "react";
import "../style/transfer.css";
import Select from "react-select";
import Success from "./SucsesFull";
import { BASE_URL } from "./base_url.jsx";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const services = [];
const groups = [];

class Transfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service: "",
      group: "",
      isActive: false,

      serviceId: "",

      showSuccess: false,
      Success: "",
      text: "",
      color: false,
      isDisabled: false,

      startDate: new Date(),
      endDate: new Date(),

      startDate: dayjs(),
      endDate: dayjs(),
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  handleDateChange = (key, newValue) => {
    this.setState({ [key]: newValue });
  };

  handleSubmit(event) {
    event.preventDefault();

    const groupId = this.state.group.serviceId;
    const listServices = this.state.service.map((item) => item.value);
    const bdate = this.state.startDate;
    const edate = this.state.endDate;

    const data = {
      groupId,
      listServices,
      bdate,
      edate,
    };

    if (groupId) {
      this.setState({ isActive: true });

      fetch(`${BASE_URL}/transfer/new/manual`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            text: data.message,
            showSuccess: true,
            color: data.success,
          });

          if (data.success) {
            setTimeout(() => {
              this.setState({
                showSuccess: false,
              });
              window.location.reload();
            }, 3000);
          }

          this.setState({ isActive: false });
        })
        .catch((error) => {
          this.setState({ isActive: false });

          setTimeout(() => {
            this.setState({
              showSuccess: false,
            });
            window.location.reload();
          }, 3000);

          this.setState({
            text: "Something went wrong:",
            showSuccess: true,
            color: data.success,
          });
        });
    } else {
      document.querySelector(".errorSelect").innerHTML =
        "Select can not be null ";
    }

    this.setState({
      select: "",
      folder: "",

      status: "Active",
      showSuccess: "",
      Success: "",
    });
  }

  handleStatus = (services) => {
    if (services.some((e) => e.value === "all")) {
      this.setState({
        service: services,
        isDisabled: true,
      });
    }

    this.setState({
      service: services,
    });

    document.querySelector(".errorSelect").innerHTML = "";
  };

  componentDidMount = () => {
    if (localStorage.getItem("Role") === "ROLE_USER") {
      window.location.pathname = "/home";
    }

    fetch(`${BASE_URL}/group/all/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .then((data) => {
        data.data.forEach((element) => {
          const isElementExists = groups.some(
            (item) => item.value === element.id || item.id === element.name
          );
          if (!isElementExists) {
            groups.push({
              value: element.id,
              label: element.name,
              serviceId: element.id,
            });
          }
        });
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });
  };

  getAccessToken = () => {
    return localStorage.getItem("jwtToken");
  };

  renderSuccessMessage() {
    if (this.state.showSuccess) {
      return <Success title={this.state.text} background={this.state.color} />;
    }
    return null;
  }

  isActivateModal() {
    if (this.state.isActive) {
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

  selectDateHandler = (date, name) => {
    this.setState({
      [name]: date,
    });
  };

  handleGroup = (e) => {
    this.setState({ group: e }, () => {
      fetch(`${BASE_URL}/group/service/list/${e.serviceId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      })
        .then((response) => response.json())
        .then((data) => {
          services.length = 0;

          data.data.forEach((element) => {
            const isElementExists = services.some(
              (item) => item.value === element.id || item.id === element.name
            );
            if (!isElementExists) {
              services.push({
                value: element.id,
                label: element.name,
                serviceId: element.id,
              });
            }
          });
          this.setState({ service: "" });
        })
        .catch((error) => {
          console.error("Xatolik yuz berdi:", error);
        });
    });
  };

  render() {
    return (
      <div className="transfer">
        <form onSubmit={this.handleSubmit} className="form-body">
          <div className="form-item">
            <div className="form-left">
              <h1>From Server</h1>

              <label htmlFor="" className="form-label">
                Group
                <Select
                  value={this.state.group}
                  onChange={this.handleGroup}
                  options={groups}
                  className="user-select-modal"
                />
              </label>

              <label htmlFor="" className="form-label">
                Service
                <div style={{ display: "flex", gap: "20px" }}>
                  <Select
                    isDisabled={this.state.isDisabled}
                    value={this.state.service}
                    isMulti
                    onChange={this.handleStatus}
                    options={services}
                    className="user-select-modal"
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label htmlFor="">All</label>
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => {
                        this.setState(
                          (prevState) => ({
                            isDisabled: !prevState.isDisabled,
                          }),
                          () => {
                            if (this.state.isDisabled) {
                              this.setState({ service: services });
                            } else {
                              this.setState({ service: [] });
                            }
                          }
                        );
                      }}
                      checked={this.state.isDisabled}
                    />
                  </div>
                </div>
              </label>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "8px" }}>Begin date</label>
                    <DatePicker
                      value={this.state.startDate}
                      onChange={(newValue) =>
                        this.handleDateChange("startDate", newValue)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "8px" }}>End date</label>
                    <DatePicker
                      value={this.state.endDate}
                      onChange={(newValue) =>
                        this.handleDateChange("endDate", newValue)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </div>
              </LocalizationProvider>

              <div className="errorSelect"></div>
            </div>

            <button type="submit" className="form-btn">
              Transfer
            </button>
          </div>
        </form>
        {this.isActivateModal()}
        {this.renderSuccessMessage()}
      </div>
    );
  }
}

export default Transfer;
