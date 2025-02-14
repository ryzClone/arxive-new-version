import React, {Component } from "react";
import "../style/AddService.css";
import Select from 'react-select';
import Success from './SucsesFull';
import {BASE_URL} from "./base_url.jsx"


import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const UsersList = [];
const GroupsList = [];

class AddUserJoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      groups: [],

      showSuccess: false,
      Success: '',
      text:"",
      color: false,
    };
  }

  handleStatusChangeUsers = (users) => {
    this.setState({ users }, () =>
      this.state.users
    );
  };  

  handleStatusChangeStatus = (status) => {
    this.setState({ status }, () =>
      this.state.status
    );
  };

  handleStatusChangeGroup = (groups) => {
    this.setState({ groups }, () =>
      this.state.groups
    );
  };

  FormSubmit = () => {

    setTimeout(() => {
      this.setState({
        showSuccess: false,
      });
      // window.location.reload();
    }, 3000);


    const userList = this.state.users.map(item => item.value);
    const groupList = this.state.groups.map(item => item.value);

    const data = {
      userList,
      groupList,
    };
    fetch(`${BASE_URL}/user/group`, {
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
          showSuccess:true,
          color:data.success,
        })
      
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);

        this.setState({
          text: "Something went wrong:",
          showSuccess:true,
          color:data.success,
        })

      });

      this.setState({
        users: [],
        groups: [],

        showSuccess: '',
        Success: '',
      });


  }

  handleFormSubmit = (e) => {
    e.preventDefault();
  }

  componentDidMount = () => {
    if(localStorage.getItem('Role') === "ROLE_USER"){
      window.location.pathname = "/home"
    }
    this.SelectList();
  }

  SelectList = () => {

    fetch(`${BASE_URL}/user/add/group/select`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {

        data.data.serviceList.forEach((e) => {
          const isDuplicate = GroupsList.some(item => item.value === e.id && item.label === e.name);
        
          if (!isDuplicate) {
            GroupsList.push({ value: e.id, label: e.name });
          }
        });

        data.data.existList.forEach((e) => {
          const isDuplicate = UsersList.some(item => item.value === e.id && item.label === e.name);
        
          if (!isDuplicate) {
            UsersList.push({ value: e.id, label: e.name });
          }
        });

      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });

  }

  getAccessToken = () => {
    return localStorage.getItem("jwtToken");
  };

  renderSuccessMessage() {
    if (this.state.showSuccess) {
      return (
        <Success title={this.state.text} background={this.state.color}/>
      );
    }
    return null;
  }

  render() {
    return (
      
    <div className="add-service">
        <form action="" className="add-service-form" onClick={this.handleFormSubmit }>

          <h1>Add User to Group</h1>

          <div className="add-service-status">

            <h3>Users</h3>

            <div className="add-service-input">

              <Select className="group-input-selects" closeMenuOnSelect={true} components={animatedComponents} value={UsersList.name} isMulti options={UsersList} onChange={this.handleStatusChangeUsers} />

            </div>

          </div>

          <div className="add-service-status">
 
            <h3>Groups</h3>

            <div className="add-service-input">

              <Select className="group-input-selects" closeMenuOnSelect={true} components={animatedComponents} value={GroupsList.name} isMulti options={GroupsList} onChange={this.handleStatusChangeGroup} />

            </div>

          </div>

          <div className="add-service-btn-body">   

            <button type="submit" className="add-service-btn" onClick={this.FormSubmit}>
                Submit
            </button>

          </div>

        </form>
        {this.renderSuccessMessage()}
    </div>
    );
  }
}

export default AddUserJoin;
