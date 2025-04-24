import React, { Component } from "react";
import "../style/Group.css";
import { BASE_URL } from "../components/base_url";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      status: 'All',
      sort: 1,
      list: 50,
      DubleList: 25,
      formDisplay: false,
      isOpen: false,
    };
  }

  componentDidMount() {
    if (!window.localStorage.getItem("jwtToken")) {
      window.location.pathname = "/";
    }
    this.WithPermission();
  }

  getAccessToken = () => {
    return localStorage.getItem("jwtToken");
  };

  WithPermission = () => {
    const name = localStorage.getItem("FolderName");
    const volume = localStorage.getItem("VolumeName");
    const page = this.state.sort - 1;
    const size = this.state.DubleList;

    const data = {
      name,
      page,
      size,
      volume,
    };

    fetch(`${BASE_URL}/home/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        this.TableBackUser(data.data);
        this.setState({ list: data.count });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  TableBackUser = (data) => {
    let Tbody = document.querySelector(".Table-tbody");

    if (!Tbody) {
      console.error("Error: .Table-tbody not found");
      return;
    }

    Tbody.innerHTML = "";

    data.forEach((element) => {
      let tr = document.createElement("tr");
      tr.className = "table-tr-withPermission";

      let tdId = document.createElement("td");
      tdId.innerHTML = element.index;
      tdId.className = "table-th-withPermission";
      tr.appendChild(tdId);

      let tdUsername = document.createElement("td");
      tdUsername.innerHTML = element.fileName;
      tdUsername.className = "padding-withPermission";
      tr.appendChild(tdUsername);

      let rdSize = document.createElement("td");
      rdSize.innerHTML = element.size;
      tr.appendChild(rdSize);

      let tdLastModified = document.createElement("td");
      tdLastModified.innerHTML = element.lastModified;
      tr.appendChild(tdLastModified);

      tr.addEventListener("click", () => {
        fetch(
          `${BASE_URL}/home/download?folder=${localStorage.getItem("FolderName")}&file=${element.fileName}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.getAccessToken()}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
          })
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", element.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });

      Tbody.appendChild(tr);
    });
  };

  toggleDropdown = () => {
    const dropdown = document.querySelector('.sortBtnList');
    dropdown.classList.toggle('active');
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  handleSelect = (event, value) => {
    this.setState({ DubleList: value, sort: 1, isOpen: true }, () => {
      this.WithPermission();
    });
  };

  render() {
    return (
      <div className="main read-group-margin">
        <div className="join-group-header-body">
          <div className="join-group-header-title">Logs</div>
        </div>

        <div className="Slide">
          <div className="slide-menu">
            <div className="sortBtn cursor" onClick={this.dubleSortMin}>{"<<"}</div>
            <div className="sortBtn cursor" onClick={this.sortMin}>{"<"}</div>
            <li className="sortBasc sortBtn">{this.state.sort}</li>
            <div className="sortBtn cursor" onClick={this.sortMax}>{">"}</div>
            <div className="sortBtn cursor" onClick={this.dubleSortMax}>{">>"}</div>
          </div>

          <div className="sortBtnList" onClick={this.toggleDropdown}>
            <div className="select-selected">
              {this.state.DubleList} {this.state.isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </div>
            <div className="select-items">
              <div onClick={(event) => this.handleSelect(event, 25)}>25</div>
              <div onClick={(event) => this.handleSelect(event, 100)}>100</div>
              <div onClick={(event) => this.handleSelect(event, 200)}>200</div>
            </div>
          </div>

          <div className="sortBtn colorRed">All count: {this.state.list}</div>
        </div>

        <div className="join-group-section">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>File name</th>
                <th>Size</th>
                <th>Last modified</th>
              </tr>
            </thead>
            <tbody className="Table-tbody"></tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Logs;
