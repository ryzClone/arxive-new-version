import React, { useState, useEffect } from "react";
import "../style/joingroup.css";
import FilterImg from "../png/section/aside/white-filter.png";
import FilterClose from "../png/section/aside/whiteClose.png";
import {BASE_URL} from "./base_url.jsx"

const History = () => {

  const [sort, setSort] = useState(1);
  const [list, setList] = useState(50);
  const [DubleList, setDubleList] = useState(15);
  const [Display, setDisplay] = useState(false);

  const [hostNames, setHostname] = useState('');
  const [serviceNames, setServiceName] = useState('');

  const [FilterName, setFilterName] = useState('');
  const [FilterHost, setFilterHost] = useState('');

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
    setHostname('');
    setServiceName('');
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
    setServiceName('');
    setHostname('');
    setFilterName(serviceNames);
    setFilterHost(hostNames);
  }


  const sayt = () => {
    const hostName = hostNames;
    const serviceName = serviceNames;
    const page = sort - 1;
    const size = DubleList;

    const data = {
        hostName,
        serviceName,
        page,
        size,
    };

    fetch(`${BASE_URL}/history/list`, {
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
      tr.className = "tr-tbody"

      let tdId = document.createElement('td');
      tdId.innerHTML = element.index;
      tr.appendChild(tdId);

      let tdAuthor = document.createElement('td');
      tdAuthor.innerHTML = element.author;
      tr.appendChild(tdAuthor);

      let tdHostname = document.createElement('td');
      tdHostname.innerHTML = element.hostName;
      tr.appendChild(tdHostname);

      let tdServicename = document.createElement('td');
      tdServicename.innerHTML = element.serviceName;
      tr.appendChild(tdServicename);

      let tdDate = document.createElement('td');
      tdDate.innerHTML = element.date;
      tr.appendChild(tdDate);

      
      let tdSpend = document.createElement('td');
      tdSpend.innerHTML = element.spendTime;
      tr.appendChild(tdSpend);

      let tdFiles = document.createElement('td');
      tdFiles.innerHTML = element.count;
      tr.appendChild(tdFiles);

      Tbody.appendChild(tr);
    });
  };

  useEffect( () => {
    if (localStorage.getItem('Role') === "ROLE_USER") {
      window.location.pathname = "/home"
    }else{
      sayt()
    }
  },[sort , DubleList , FilterName , FilterHost])


  const SortBtnList = (e) => {
    setDubleList(e.target.value);
    setSort(1);
  };

  return (
  <div className="join-group">

    <div className="join-group-header">

      <div className="join-group-header-body">
          <div className="join-group-header-title">
            History
          </div>

          <div className="group-main-items">

              <button className="group-main-item-list3" onClick={formFiltre}>Filter</button>


          </div>
      </div>

      <form action="" className="join-group-header-body-form" style={{ display: Display ? "flex" : "none" }} onClick={handleFormSubmit}>

          <div className="input-body">
            <label htmlFor="" className="group-label">Service name : </label>
            <input type="text" name="name" value={serviceNames} className="group-input" onChange={(e) => setServiceName(e.target.value)} />
          </div>

          <div className="input-body">
            <label htmlFor="" className="group-label">Host:</label>
            <input type="text" name="name" value={hostNames} className="group-input" onChange={(e) => setHostname(e.target.value)} />
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
            <th>Author</th>
            <th>Host name</th>
            <th>Service name</th>
            <th>Transfer date</th>
            <th>Spend time</th>
            <th>Count of files</th>
          </tr>
        </thead>

        <tbody className="Table-tbody">
        </tbody>

      </table>

    </div>
  </div>
  );
};

export default History;
