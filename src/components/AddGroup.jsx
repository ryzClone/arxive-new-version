import React, { Component } from 'react';
import "../style/Adduser.css";
import Select from 'react-select';
import Success from './SucsesFull';
import {BASE_URL} from "./base_url.jsx"


const status = [
  { value: true, label: 'Active' },
  { value: false, label: 'No active' },
];

const ServiceList = [];

class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
        groupName: '',
        serviceName: '',
        status:"",

        showSuccess: false,
        Success: '',
        text:"",
        color: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.setState({
        showSuccess: false,
      });
      window.location.reload();
    }, 3000);

    const name = this.state.groupName;
    const serviceList = this.state.serviceName.map(item => item.value);

    const status = this.state.status === "" ? true : this.state.status.value;

    const data = {
      name,
      status,
      serviceList,
    };
    

    fetch(`${BASE_URL}/group/add`, {
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
        serviceName: '',
        groupName: '',

        status:"Active",
        showSuccess: '',
        Success: '',
      });

  };

   getAccessToken = () => {
    return localStorage.getItem("jwtToken");
  };


  handleInputChange = (event) => {
    const inputName = event.target.name;
    this.setState({ [inputName]: event.target.value });
  };

  renderSuccessMessage() {
    if (this.state.showSuccess) {
      return (
        <Success title={this.state.text} background={this.state.color}/>
      );
    }
    return null;
  }

  handleStatus = (status) => {

    this.setState({ status }, () =>
      this.state.status
    );

  }

  handleGroup = (serviceName) => {
    this.setState({ serviceName }, () =>
      this.state.serviceName
    );
  }

  componentDidMount = () => {
    if(localStorage.getItem('Role') === "ROLE_USER"){
      window.location.pathname = "/homes"
    }
    this.serviceName();
  }

  serviceName = () => {

    fetch(`${BASE_URL}/service/all/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {

        data.data.forEach((e) => {
          const isDuplicate = ServiceList.some(item => item.value === e.id && item.label === e.name);
        
          if (!isDuplicate) {
            ServiceList.push({ value: e.id, label: e.name });
          }
        });

      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });

  }



  render() {
    return (
      <div className='add-user' id='Add-user'>

        <form onSubmit={this.handleSubmit} className='user-form'>

          <h1 className='user-title'>Add Group</h1>

            <input
              type='text'
              name='groupName'
              value={this.state.groupName}
              onChange={this.handleInputChange}
              className='user-input'
              placeholder='Group name'
              required
            />

          <Select value={this.state.serviceName} isMulti onChange={this.handleGroup} options={ServiceList} className='user-select-modal' />


          <Select value={this.state.status} onChange={this.handleStatus} options={status} className='user-select-modal' />


          <button type='submit' className='user-btn'>
            Submit
          </button>

        </form>

        {this.renderSuccessMessage()}
      </div>
    );
  }
}

export default AddGroup;
