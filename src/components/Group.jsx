import React, { useState, useEffect } from "react";
import "../style/joingroup.css";
import { Link } from "react-router-dom";
import Select from 'react-select';
import Success from "./SucsesFull";
import FilterImg from "../png/section/aside/white-filter.png";
import FilterClose from "../png/section/aside/whiteClose.png";
import Update from "../png/section/aside/update.png";
import Delete from "../png/section/aside/delete.png";
import {BASE_URL} from "./base_url.jsx"

const Group = () => {
  const [sort, setSort] = useState(1);
  const [list, setList] = useState(50);
  const [DubleList, setDubleList] = useState(15);
  const [Display, setDisplay] = useState(false);

  const [Groupname, setGropname] = useState('');
  const [Id, setId] = useState(null);

  const [text, setText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userMap, setUsermap] = useState([]);
  const [selectedServiceList, setSelectedServiceList] = useState([]);

  const [FilterName , setFilterName] = useState('');

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

  const sayt = () => {
    const name = Groupname;
    const page = sort - 1;
    const size = DubleList;

    const data = {
      name,
      page,
      size,
    };

    fetch(`${BASE_URL}/group/list`, {
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
      tdUsername.innerHTML = element.name;
      tr.appendChild(tdUsername);

      let tdGroupname = document.createElement('td');
      let tdGroupnameUl = document.createElement('ul');
      tdGroupname.className = "tbody-th-select";
      tdGroupnameUl.className = "tbody-ul";

      if (element.serviceList.length >= 1) {
        element.serviceList.forEach((el) => {
          const tdGroupnameLi = document.createElement('li');
          tdGroupnameLi.innerHTML = el.name;
          tdGroupnameUl.appendChild(tdGroupnameLi);
        });
      }

      tdGroupname.appendChild(tdGroupnameUl);
      tr.appendChild(tdGroupname);

      let tdStatus = document.createElement('td');
      tdStatus.innerHTML = element.status;
      tr.appendChild(tdStatus);

      let tdBtn = document.createElement('td');
      tdBtn.className = "readUserSrcBody";
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

      Updates.addEventListener('click', () => {

        fetch(`${BASE_URL}/group/list/service/${element.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUsermap([]);
            setSelectedServiceList([]);

            const newServiceList = data.data.serviceList.map((e) => ({
              value: e.id,
              label: e.name,
            }));

            const newExistList = data.data.existList.map((e) => ({
              value: e.id,
              label: e.name,
            }));

            setUsermap((prevUserMap) => [...prevUserMap, ...newServiceList]);
            setSelectedServiceList((existList) => [...existList, ...newExistList]);
          })
          .catch((error) => {
            console.error("Xatolik yuz berdi:", error);
          });

        document.getElementById('modalDelete').style.display = "flex";
        document.getElementById('formModalBtn').style.display = "flex";
        document.getElementById('modal-delete-body').style.display = "flex";
        document.querySelector('.join-group-header-body-form').style.display = "none";
        document.getElementById('formModalDelete').style.display = "none";
        setId(element.id);
        setGropname(element.name);
      });

      Deletes.addEventListener('click', () => {
        document.getElementById('modalDelete').style.display = "flex";
        document.getElementById('formModalBtn').style.display = "none";
        document.getElementById('modal-delete-body').style.display = "flex";
        document.querySelector('.join-group-header-body-form').style.display = "none";
        document.getElementById('formModalDelete').style.display = "flex";
        setId(element.id);
      });

      tdBtn.appendChild(Updates);
      tdBtn.appendChild(Deletes);
      tr.appendChild(tdBtn);

      Tbody.appendChild(tr);
    });
  };

  useEffect(() => {
    if (localStorage.getItem('Role') === "ROLE_USER") {
      window.location.pathname = '/home'
    } else {
      sayt();
    }
  }, [sort, DubleList , FilterName]);

  const SortBtnList = (e) => {
    setDubleList(e.target.value);
    setSort(1);
  };

  const OffUpdateModal = () => {
    setGropname('');
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

    const id = Id;
    const name = Groupname;
    const serviceList = selectedServiceList.map((service) => service.value); 

    const data = {
      id,
      name,
      serviceList,
    };

    fetch(`${BASE_URL}/group/update/${Id}`, {
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
    document.getElementById('formModalDelete').style.display = "none";
  }

  const DeleteUser = () => {
    setTimeout(() => {
      setShowSuccess(false);
      window.location.reload();
    }, 3000);

    fetch(`${BASE_URL}/group/delete/${Id}`, {
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
    document.getElementById('formModalDelete').style.display = "none";
  }

  const renderSuccessMessage = () => {
    if (showSuccess) {
      return (
        <Success title={text} background={success} />
      );
    }
  }

  const formFiltre = () => {
    setGropname('');
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
    setGropname('');
    setFilterName(Groupname);
  }

  const handleStatusChangeUsers = (users) => {
    setSelectedServiceList(users);
  };

  return (
    <div className="join-group">

      <div className="join-group-header">
        <div className="join-group-header-body">
          <div className="join-group-header-title">
            Group
          </div>
          <div className="group-main-items">
            <button className="group-main-item-list3" onClick={formFiltre}>Filter</button>
            <Link to="/home/group/addgroup" className="join-group-header-btn" title="Transfer"> Add Groups </Link>
          </div>
        </div>
        <form action="" className="join-group-header-body-form" style={{ display: Display ? "flex" : "none" }} onClick={handleFormSubmit}>
          <div className="input-body">
            <label htmlFor="" className="group-label">Group name: </label>
            <input type="text" name="groupname" value={Groupname} className="group-input" onChange={(e) => setGropname(e.target.value)} />
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
              <th>Group name</th>
              <th>Service name</th>
              <th>Status</th>
              <th className="join-group-table-center"></th>
            </tr>
          </thead>
          <tbody className="Table-tbody">
            {/* Table rows will be dynamically added here */}
          </tbody>
        </table>
        
        <div className="modalDelete" id="modalDelete"></div>
        <div className="modal-delete-body" id="modal-delete-body">
          <div className="formModalDelete" id="formModalDelete">
            <div className="formModalDelete-forms">
              <div className="formModalDelete-title">Do you want to delete ?</div>
              <div className="formModalDelete-btn-body">
                <button className="formModalDelete-btn-body-btn green" onClick={OffUpdateModal}>Cancel</button>
                <button className="formModalDelete-btn-body-btn red" onClick={DeleteUser}>Delete</button>
              </div>
            </div>
          </div>
          <form action="" className="formModalBtn" onClick={(e) => modalFormClick(e)} id="formModalBtn">
            <h1>Update Group </h1>
            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Group name : </label>
              <input type="text" name="" id="" className="formModalBtn-inputs-item" value={Groupname} onChange={(e) => setGropname(e.target.value)} />
            </div>
            <div className="formModalBtn-inputs">
              <label htmlFor="" className="formModalBtn-inputs-label">Services : </label>
              <Select className="user-select-modal" closeMenuOnSelect={true} defaultValue={selectedServiceList} value={selectedServiceList} isMulti options={userMap} onChange={(e) => handleStatusChangeUsers(e)} />
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

export default Group;
