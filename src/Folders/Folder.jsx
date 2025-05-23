import React, { Component } from "react";
import "../style/Group.css";
import { BASE_URL } from "../components/base_url";
import { FaChevronDown, FaChevronUp } from "react-icons/fa" 

class Folders extends Component {
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

    this.dubleSortMin = this.dubleSortMin.bind(this);
    this.sortMin = this.sortMin.bind(this);
    this.sortMax = this.sortMax.bind(this);
    this.dubleSortMax = this.dubleSortMax.bind(this);
    this.WithPermission = this.WithPermission.bind(this);
    this.TableBackUser = this.TableBackUser.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }


  dubleSortMin() {
    if (this.state.sort >= 3) {
      this.setState({ sort: this.state.sort - 2 }, () => {
        this.WithPermission(); 
      });
    }
  }

  sortMin() {
    if (this.state.sort >= 2) {
      this.setState({ sort: this.state.sort - 1 }, () => {
        this.WithPermission();
      });
    }
  }

  sortMax() {
    if (
      this.state.sort < Math.ceil(this.state.list / this.state.DubleList)
    ) {
      this.setState({ sort: this.state.sort + 1 }, () => {
        this.WithPermission(); 
      });
    }
  }

  dubleSortMax() {
    if (
      this.state.sort <
      Math.ceil(this.state.list / this.state.DubleList) - 1
    ) {
      this.setState({ sort: this.state.sort + 2 }, () => {
        this.WithPermission(); 
      });
    }
  }

  WithPermission() {
    const name = localStorage.getItem('UserName');
    const volume = localStorage.getItem('VolumeName');
    const page = this.state.sort - 1;
    const size = this.state.DubleList;

    const data = {
      name,
      page,
      size,
      volume,
    };

    fetch(`${BASE_URL}/service/user/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        this.TableBackUser(data.data);
        this.setState({ list: data.data.count });
      })
      .catch((error) => {
        console.error('Xatolik yuz berdi:', error);
      });
  }

  TableBackUser(data) {
    let Tbody = document.querySelector('.Table-tbody');

    if (!Tbody) {
      console.error('Error: .Table-tbody not found');
      return;
    }

    Tbody.innerHTML = '';

    data.list.forEach((element) => {
      let tr = document.createElement('tr');
      tr.className='table-tr-withPermission'

      let tdId = document.createElement('td');
      tdId.innerHTML = element.index;
      tdId.className = "table-th-withPermission"
      tr.appendChild(tdId);

      let tdUsername = document.createElement('td');
      tdUsername.innerHTML = element.name;
      tdUsername.className = 'padding-withPermission'
      tr.appendChild(tdUsername);

      tr.addEventListener('click' , () => {
        localStorage.setItem("ServiceName",element.name);
        window.location.pathname = '/home/subfolder'
      })

      Tbody.appendChild(tr);
    });
  }

  getAccessToken() {
    return localStorage.getItem('jwtToken');
  }

  componentDidMount() {
    if (!window.localStorage.getItem('jwtToken')) {
      window.location.pathname = '/';
    }
    this.WithPermission();
  }

  handleSelect = (event, value) => {
    this.setState(
      {
        DubleList: value,
        sort: 1,
      },
      () => {
        this.WithPermission();
      }
    );
    this.setState({ DubleList: value, isOpen: true });
  };
  
  toggleDropdown = () => {
    const dropdown = document.querySelector('.sortBtnList');
    dropdown.classList.toggle('active');
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };
  

  render() {
    return (
      <div className="main read-group-margin">
        <div className="join-group-header-body">
          <div className="join-group-header-title">Services</div>
        </div>

        <div className="Slide">
          <div className="slide-menu">
            <div className="sortBtn cursor" onClick={this.dubleSortMin}>
              {"<<"}
            </div>

            <div className="sortBtn cursor" onClick={this.sortMin}>
              {"<"}
            </div>

            <li className="sortBasc sortBtn">{this.state.sort}</li>

            <div className="sortBtn cursor" onClick={this.sortMax}>
              {">"}
            </div>

            <div className="sortBtn cursor" onClick={this.dubleSortMax}>
              {">>"}
            </div>
          </div>

          <div className="sortBtnList" onClick={this.toggleDropdown}>
            <div className="select-selected">
              {this.state.DubleList || 25} 
              {this.state.isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
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
                <th>Folder name</th>
              </tr>
            </thead>

            <tbody className="Table-tbody"></tbody>
          </table>
        </div>
        
      </div>
    );
  }
}

export default Folders;
