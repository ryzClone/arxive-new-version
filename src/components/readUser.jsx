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

const ReadUser = () => {
  const [sort, setSort] = useState(1);
  const [list, setList] = useState(50);
  const [DubleList, setDubleList] = useState(15);
  const [Display, setDisplay] = useState(false);

  const [UserName, setUserName] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Password , setPassword] = useState('');
  const [Role, setRole] = useState('');
  const [Status, setStatus] = useState(true);
  const [Id, setId] = useState(null);


  const [text, setText] = useState('');
  const [showSuccess , setShowSuccess] = useState(false);
  const [success , setSuccess] = useState(false);

  const [FilterName , setFilterName] = useState('');
  const [FilterFirs , setFilterFirs] = useState('');
  const [FilterLast , setFilterLast] = useState('');

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
    setUserName('');
    setFirstName('');
    setLastName('');
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
    setFirstName('');
    setLastName('');
    setUserName('');
    setFilterName(UserName);
    setFilterLast(LastName);
    setFilterFirs(FirstName);
  }


  const sayt = () => {
    const username = UserName;
    const firstName = FirstName;
    const lastName = LastName;
    const page = sort - 1;
    const size = DubleList;

    const data = {
      username,
      firstName,
      lastName,
      page,
      size,
    };

    fetch(`${BASE_URL}/user/list`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {                
        setList(data.data.count)        
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

      let tdUsername = document.createElement('td');
      tdUsername.innerHTML = element.username;
      tr.appendChild(tdUsername);

      let tdFirstname = document.createElement('td');
      tdFirstname.innerHTML = element.firstName;
      tr.appendChild(tdFirstname);

      let tdLastname = document.createElement('td');
      tdLastname.innerHTML = element.lastName;
      tr.appendChild(tdLastname);

      let tdRole = document.createElement('td');
      if (element.role === "ROLE_ADMIN") {
        tdRole.innerHTML = 'admin';
      } else if (element.role === "ROLE_MODERATOR") {
        tdRole.innerHTML = 'moderator';
      } else {
        tdRole.innerHTML = 'user';
      }
      tr.appendChild(tdRole);

      let tdStatus = document.createElement('td');
      tdStatus.innerHTML = element.status;
      tr.appendChild(tdStatus);

      let tdBtn = document.createElement('td');
      tdBtn.classList = "readUserSrcBody padding";
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
        setUserName(element.username);
        setFirstName(element.firstName);
        setLastName(element.lastName);
        setRole(element.role);
        setStatus(element.status);
        document.getElementById('modalDelete').style.display = "flex";
        document.getElementById('formModalBtn').style.display = "flex";
        document.getElementById('modal-delete-body').style.display = "flex";
        document.querySelector('.join-group-header-body-form').style.display = "none";
        document.getElementById('formModalDelete').style.display = "none";
        setId(element.id);
      })

      Deletes.addEventListener('click' , () => {
        document.getElementById('modalDelete').style.display = "flex";
        document.getElementById('formModalBtn').style.display = "none";
        document.getElementById('modal-delete-body').style.display = "flex";
        document.querySelector('.join-group-header-body-form').style.display = "none";
        document.getElementById('formModalDelete').style.display = "flex";
        setId(element.id);
      })


      tdBtn.appendChild(Updates);
      tdBtn.appendChild(Deletes);
      tr.appendChild(tdBtn);

      Tbody.appendChild(tr);
    });
  };

  useEffect(() => {
    if (localStorage.getItem('Role') === "ROLE_USER") {
      window.location.pathname = "/home";
    } else {
      sayt();
    }
  }, [sort, DubleList , FilterName , FilterFirs , FilterLast]);


  const SortBtnList = (e) => {
    setDubleList(e.target.value);
    setSort(1)
  };
  
  const role = [
    { value: 'ROLE_USER', label: 'User' },
    { value: 'ROLE_ADMIN', label: 'Admin' },
    { value: 'ROLE_MODERATOR', label: 'Moderator' },
  ];

  const status = [
    { value: true, label: 'Active' },
    { value: false, label: 'No active' },
  ];

  const handleChangeRole = (role) => {
    setRole(role)
  };

  const handleChangeStatus = (status) => {
    setStatus(status)
  };

  const OffUpdateModal = () => {
    setUserName('');
    setFirstName('');
    setLastName('');
    setPassword('');
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
        window.location.reload();
    }, 3000);

    const firstName = FirstName;
    const lastName = LastName;
    const username = UserName;
    const role = Role.value;
    const status = Status === undefined ? true : Status.value;
    const password = Password;

    const data = {
      firstName,
      lastName,
      username,
      password,
      role,
      status,
    };    

    fetch(`${BASE_URL}/user/update/${Id}`, {
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

      setUserName('');
      setFirstName('');
      setLastName('');
      setRole('');
      setStatus('');
      setPassword('');
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


      fetch(`${BASE_URL}/user/delete/${Id}`, {
      method: "PUT",
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

  const handleSelect = (event, value) => {
    setDubleList(value);
    setSort(1);
  };
  
  const toggleDropdown = () => {
    const dropdown = document.querySelector('.sortBtnList');
    dropdown.classList.toggle('active');
  };
  

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
            Users
          </div>

          <div className="group-main-items">

              <button className="group-main-item-list3" onClick={formFiltre}>Filter</button>

              <Link to="/home/readuser/adduser" className="join-group-header-btn" title="Transfer">  Add User </Link>

          </div>
      </div>

      <form action="" className="join-group-header-body-form" style={{ display: Display ? "flex" : "none" }} onClick={handleFormSubmit}>

          <div className="input-body">
            <label htmlFor="" className="group-label">Username: </label>
            <input type="text" name="name" value={UserName} className="group-input" onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className="input-body">
            <label htmlFor="" className="group-label">Firstname:</label>
            <input type="text" name="name" value={FirstName} className="group-input" onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="input-body">
            <label htmlFor="" className="group-label">Lastname: </label>
            <input type="text" name="name" value={LastName} className="group-input" onChange={(e) => setLastName(e.target.value)} />
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
            <div className="sortBtn cursor" onClick={dubleSortMin}>
              {"<<"}
            </div>

            <div className="sortBtn cursor" onClick={sortMin}>
              {"<"}
            </div>

            <li className="sortBasc sortBtn">{sort}</li>

            <div className="sortBtn cursor" onClick={sortMax}>
              {">"}
            </div>

            <div className="sortBtn cursor" onClick={dubleSortMax}>
              {">>"}
            </div>
          </div>

          <div className="sortBtnList" onClick={toggleDropdown}>
            <div className="select-selected">
              {DubleList || 25} {/* Dastlabki qiymat 15 */}
            </div>
            <div className="select-items">
              <div onClick={(event) => handleSelect(event, 25)}>25</div>
              <div onClick={(event) => handleSelect(event, 100)}>100</div>
              <div onClick={(event) => handleSelect(event, 200)}>200</div>
            </div>
          </div>

          <div className="sortBtn colorRed">All count: {list}</div>
        </div>

    <div className="join-group-section">
    
      <table>

        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Role</th>
            <th>Status</th>
            <th className="join-group-table-center">
              active
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

            <h1>Update User </h1>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Username : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={UserName} onChange={(e) => setUserName(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Firstname : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={FirstName} onChange={(e) => setFirstName(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Lastname : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={LastName} onChange={(e) => setLastName(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Password : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={Password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Role : </label>
              <Select value={Role} onChange={(e) => handleChangeRole(e)} options={role} className='user-select-modal' required/>
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

export default ReadUser;
