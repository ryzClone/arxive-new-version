import React, { useState, useEffect } from "react";
import "../style/joingroup.css";
import { Link } from "react-router-dom";
import FilterImg from "../png/section/aside/white-filter.png";
import FilterClose from "../png/section/aside/whiteClose.png";
import Update from "../png/section/aside/update.png";
import Delete from "../png/section/aside/delete.png";
import Select from 'react-select';
import Success from "./SucsesFull";
import {BASE_URL} from "./base_url.jsx"

const AddService = () => {
  const [sort, setSort] = useState(1);
  const [list, setList] = useState(50);
  const [DubleList, setDubleList] = useState(15);
  const [Display, setDisplay] = useState(false);

  const [servicname , setServicename] = useState('');
  const [Status, setStatus] = useState(true);
  const [servicIp, setIp] = useState('');
  const [servicePort, setPort] = useState('');
  const [serverPriority, setserverPriority] = useState('');
  const [ServiceId, setServiceId] = useState(null);
  
  const [text, setText] = useState('');
  const [showSuccess , setShowSuccess] = useState(false);
  const [success , setSuccess] = useState(false);

  const [FilterName , setFilterName] = useState('');
  const [FilterIp , setFilterIp] = useState('');


  const dubleSortMin = () => {
    if (sort >= 3) {
      setSort((prevSort) => prevSort - 2);
    }
  };

  const sortMin = () => {
    if (sort >= 2) {
      setSort((prevSort) => prevSort - 1);
    }
  };

  const sortMax = () => {
    if (sort < Math.ceil(list / DubleList)) {
      setSort((prevSort) => prevSort + 1);
    }
  };

  const dubleSortMax = () => {
    if (sort < Math.ceil(list / DubleList) - 1) {
      setSort((prevSort) => prevSort + 2);
    }
  };

  const formFiltre = () => {
    setServicename('');
    setStatus('');
    setIp('');
    setDisplay(!Display);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
  }

  const handleFormSubmites = () => {
    setSort(1);
    sayt();
  }

  const handleFormClear = () => {
    setServicename('');
    setIp('');
    setFilterName(servicname);
    setFilterIp(servicIp);
  }


  const sayt = () => {
    const name = servicname;
    const username = '';
    const ip = servicIp;
    const user = ''
    const page = sort - 1;
    const size = DubleList;

    const data = {
      name,
      username,
      ip,
      user,
      page,
      size,
    };


    fetch(`${BASE_URL}/service/list`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setList(data.data.count);
        TableBackUser(data.data.list);
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });

  };

  const getAccessToken = () => {
    return localStorage.getItem("jwtToken");
  };

  const TableBackUser = (data) => {
    let Tbody = document.querySelector('.Table-tbody');
    Tbody.innerHTML = '';

    data.forEach((element) => {
      let tr = document.createElement('tr');

      let tdId = document.createElement('td');
      tdId.innerHTML = element.index;
      tr.appendChild(tdId);

      let tdServicename = document.createElement('td');
      tdServicename.innerHTML = element.serviceName;
      tr.appendChild(tdServicename);


      const tdp = document.createElement('td');
      tdp.innerHTML = element.ip;
      tr.appendChild(tdp);

      let tdPort = document.createElement('td');
      tdPort.innerHTML = element.port;
      tr.appendChild(tdPort);

      let tdPriority = document.createElement('td');
      tdPriority.innerHTML = element.priority;
      tr.appendChild(tdPriority);

      let tdStatus = document.createElement('td');
      tdStatus.innerHTML = element.status;
      tr.appendChild(tdStatus);

      let tdBtn = document.createElement('td');
      tdBtn.classList = "readUserSrcBody";
      let Updates = document.createElement('button');
      let Deletes = document.createElement('button');
      let imgUpdate = document.createElement('img');
      let imgDelete = document.createElement('img');
      Updates.className = "readUserBtn";
      Deletes.className = "readUserBtn";
      imgUpdate.className = "readUserSrcUpdate";
      imgDelete.className = "readUserSrcDelete";
      imgUpdate.src = Update;
      imgUpdate.alt = "";
      imgDelete.src = Delete;
      imgDelete.alt = "";
      Updates.appendChild(imgUpdate);
      Deletes.appendChild(imgDelete);

      Updates.addEventListener('click' , () => {
        setServicename(element.serviceName);
        setIp(element.ip);
        setPort(element.port);
        setStatus(element.status);
        setServiceId(element.id);
        setserverPriority(element.priority);


        document.getElementById('modalDelete').style.display = "flex";
        document.getElementById('formModalBtn').style.display = "flex";
        document.getElementById('modal-delete-body').style.display = "flex";
        document.querySelector('.join-group-header-body-form').style.display = "none";
        document.getElementById('formModalDelete').style.display = "none";
      })

      Deletes.addEventListener('click' , () => {
        document.getElementById('modalDelete').style.display = "flex";
        document.getElementById('formModalBtn').style.display = "none";
        document.getElementById('modal-delete-body').style.display = "flex";
        document.querySelector('.join-group-header-body-form').style.display = "none";
        document.getElementById('formModalDelete').style.display = "flex";
        setServiceId(element.id);
      })


      tdBtn.appendChild(Updates);
      tdBtn.appendChild(Deletes);
      tr.appendChild(tdBtn);

      Tbody.appendChild(tr);
    });
  };

  useEffect( () => {
    if (localStorage.getItem('Role') === "ROLE_USER") {
      window.location.pathname = "/home"
    }else{
      sayt()
    }
  },[sort , DubleList , FilterName , FilterIp])


  const SortBtnList = (e) => {
    setDubleList(e.target.value);
    setSort(1)
  };
  

  const status = [
    { value: true, label: 'Active' },
    { value: false, label: 'No active' },
  ];

  const handleChangeStatus = (status) => {
    setStatus(status)
  };

  const OffUpdateModal = () => {
    setServicename('');
    setIp('');
    document.getElementById('modalDelete').style.display = "none";
    document.getElementById('modal-delete-body').style.display = "none";
    document.getElementById('formModalBtn').style.display = "none";
  }

  const modalFormClick = (e) => {
    e.preventDefault();
  }

  const sendUpdateModal = () => {

    setTimeout(() => {
      setShowSuccess(false);
        // window.location.reload();
    }, 3000);

    const serviceName = servicname;
    const ip = servicIp;
    const port = servicePort;
    const username = null;
    const password = null;
    const priority = serverPriority === undefined ? null : serverPriority;
    const status = Status === undefined ? true : Status;

    const data = {
      serviceName,
      ip,
      port,
      username,
      password,
      priority,
      status,
    };
    
    
    fetch(`${BASE_URL}/service/update/${ServiceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
          setSuccess(data.success);
          setText(data.message);
          setShowSuccess(true);
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });


      document.getElementById('modalDelete').style.display = "none";
      document.getElementById('formModalBtn').style.display = "none";
      document.getElementById('modal-delete-body').style.display = "none";
      document.querySelector('.join-group-header-body-form').style.display = "none";
      document.getElementById('formModalDelete').style.display = "none"
  }

  const DeleteUser = () => {

    setTimeout(() => {
      setShowSuccess(false);
      window.location.reload();
    }, 3000);

      fetch(`${BASE_URL}/service/delete/${ServiceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((response) => response.json())
      .then((data) => {
          setSuccess(data.success);
          setText(data.message);
          setShowSuccess(true);
      })
      .catch((error) => {
        console.error("Xatolik yuz berdi:", error);
      });

      document.getElementById('modalDelete').style.display = "none";
      document.getElementById('formModalBtn').style.display = "none";
      document.getElementById('modal-delete-body').style.display = "none";
      document.querySelector('.join-group-header-body-form').style.display = "none";
      document.getElementById('formModalDelete').style.display = "none"
  }

  const renderSuccessMessage = () =>{
    if (showSuccess) {
      return (
        <Success title={text} background={success}/>
      );
    }
  }

  return (
  <div className="join-group">

    <div className="join-group-header">

      <div className="join-group-header-body">
          <div className="join-group-header-title">
            Service
          </div>

          <div className="group-main-items">

              <button className="group-main-item-list3" onClick={formFiltre}>Filter</button>

              <Link to="/home/service/addservice" className="join-group-header-btn" title="Transfer">  Add Service </Link>

          </div>
      </div>

      <form action="" className="join-group-header-body-form" style={{ display: Display ? "flex" : "none" }} onClick={handleFormSubmit}>

          <div className="input-body">
            <label htmlFor="" className="group-label">Service name: </label>
            <input type="text" name="name" value={servicname} className="group-input" onChange={(e) => setServicename(e.target.value)} />
          </div>

          <div className="input-body">
            <label htmlFor="" className="group-label">Ip host:</label>
            <input type="text" name="name" value={servicIp} className="group-input" onChange={(e) => setIp(e.target.value)} />
          </div>

          <div className="input-body-items">

            <button type="submit" style={{border:"none"}} onClick={handleFormSubmites}>
              <img src={FilterImg} alt="Submit" className="group-btn" />
            </button>

            <button type="submit" style={{border:"none"}} onClick={handleFormClear}>
              <img src={FilterClose} alt="Submit" className="group-close" />
            </button>

          </div>


      </form>

    </div>

    <div className="Slide">

              <div className="slide-menu">
                  <div className="sortBtn cursor" onClick={dubleSortMin}>{'<<'}</div>

                  <div className="sortBtn cursor" onClick={sortMin}> {'<'} </div>

                  <li className="sortBasc sortBtn">{sort}</li>

                  <div className="sortBtn cursor" onClick={sortMax}> {'>'} </div>

                  <div className="sortBtn cursor" onClick={dubleSortMax}> {'>>'} </div>
              </div>

              <div className="sortBtnList">
                  <select id="cars" onChange={SortBtnList}>
                      <option value={15} className="sortBtnList">15</option>
                      <option value={25} className="sortBtnList">25</option>
                      <option value={50} className="sortBtnList">50</option>
                  </select>
              </div>


              <div className="sortBtn colorRed">All count : {list}</div>

    </div>

    <div className="join-group-section">
    
      <table>

        <thead>
          <tr>
            <th>Id</th>
            <th>Service name</th>
            <th>Ip</th>
            <th>Port</th>
            <th>Priority</th>
            <th>Status</th>
            <th className="join-group-table-center">
            </th>
          </tr>
        </thead>

        <tbody className="Table-tbody">
        </tbody>

      </table>

      <div className="modalDelete" id="modalDelete"></div>
      <div className="modal-delete-body" id="modal-delete-body">

          <div className="formModalDelete" id="formModalDelete">

            <div className="formModalDelete-forms">
                <div className="formModalDelete-title">Do want to delete ?</div>

                <div className="formModalDelete-btn-body">
                  <button className="formModalDelete-btn-body-btn green" onClick={OffUpdateModal}>Cancel</button>
                  <button className="formModalDelete-btn-body-btn red" onClick={DeleteUser}>Delete</button>
                </div>

            </div>

          </div>

          <form action="" className="formModalBtn" onClick={(e) => modalFormClick(e)} id="formModalBtn">

            <h1>Update Service </h1>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Service name : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={servicname} onChange={(e) => setServicename(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Ip : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={servicIp} onChange={(e) => setIp(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Port : </label>
              <input type="number" name="" id="" className="formModalBtn-inputs-item" value={servicePort} onChange={(e) => setPort(e.target.value)}/>
            </div>

            
            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Priority : </label>
              <input type="number" name="" id="" className="formModalBtn-inputs-item" value={serverPriority} onChange={(e) => setPort(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Status : </label>
              <Select value={Status} onChange={(e) => handleChangeStatus(e)} options={status} className='user-select-modal' required/>
            </div>
            
            <div className="formModalBtn-inputs-btn">
              <button className="formModalBtn-inputs-btn-item-red" onClick={OffUpdateModal}>Cancel</button>
              <button className="formModalBtn-inputs-btn-item-blue" onClick={sendUpdateModal}>Update</button>
            </div>


          </form>

      </div>

    </div>

    {renderSuccessMessage()}
  </div>
  );
};

export default AddService;
