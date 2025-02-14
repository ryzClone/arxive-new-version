import React, { useState, useEffect } from "react";
import "../style/Group.css";
import { BASE_URL } from "../components/base_url";

const Logs = () => {

  const [state, setState] = useState({
    name: '',
    status: 'All',
    sort: 1,
    list: 50,
    DubleList: 25,
    formDisplay: false,
  });

  const dubleSortMin = () => {
    if (state.sort >= 3) {
      setState(prevState => ({ ...prevState, sort: prevState.sort - 2 }), () => {
        WithPermission();
      });
    }
  };

  const sortMin = () => {
    if (state.sort >= 2) {
      setState(prevState => ({ ...prevState, sort: prevState.sort - 1 }), () => {
        WithPermission();
      });
    }
  };

  const sortMax = () => {
    if (state.sort < Math.ceil(state.list / state.DubleList)) {
      setState(prevState => ({ ...prevState, sort: prevState.sort + 1 }), () => {
        WithPermission();
      });
    }
  };

  const dubleSortMax = () => {
    if (state.sort < Math.ceil(state.list / state.DubleList) - 1) {
      setState(prevState => ({ ...prevState, sort: prevState.sort + 2 }), () => {
        WithPermission();
      });
    }
  };

  const WithPermission = () => {
    const name = localStorage.getItem('FolderName');
    const page = state.sort - 1;
    const size = state.DubleList;

    const data = {
      name,
      page,
      size,
    };

    fetch(`${BASE_URL}/home/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        TableBackUser(data.data);
        setState(prevState => ({ ...prevState, list: data.count }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const TableBackUser = (data) => {
    let Tbody = document.querySelector('.Table-tbody');

    if (!Tbody) {
      console.error('Error: .Table-tbody not found');
      return;
    }

    Tbody.innerHTML = '';

    data.forEach((element) => {
      let tr = document.createElement('tr');
      tr.className = 'table-tr-withPermission';

      let tdId = document.createElement('td');
      tdId.innerHTML = element.index;
      tdId.className = "table-th-withPermission";
      tr.appendChild(tdId);

      let tdUsername = document.createElement('td');
      tdUsername.innerHTML = element.fileName;
      tdUsername.className = 'padding-withPermission';
      tr.appendChild(tdUsername);

      let rdSize = document.createElement('td');
      rdSize.innerHTML = element.size;
      tr.appendChild(rdSize);

      let tdLastModified = document.createElement('td');
      tdLastModified.innerHTML = element.lastModified;
      tr.appendChild(tdLastModified);

      tr.addEventListener('click', () => {
        fetch(`${BASE_URL}/home/download?folder=${localStorage.getItem('FolderName')}&file=${element.fileName}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json',
          },
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
            link.setAttribute('download', element.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });

      Tbody.appendChild(tr);
    });
  };

  const getAccessToken = () => {
    return localStorage.getItem('jwtToken');
  };

  useEffect(() => {
    if (!window.localStorage.getItem('jwtToken')) {
      window.location.pathname = '/';
    }
    WithPermission();
  }, []);

  const handleSelect = (event, value) => {
    setState(prevState => ({
      ...prevState,
      DubleList: value,
      sort: 1,
    }), () => {
      WithPermission();
    });
  };

  const toggleDropdown = () => {
    const dropdown = document.querySelector('.sortBtnList');
    dropdown.classList.toggle('active');
  };

  return (
    <div className="main read-group-margin">
      <div className="join-group-header-body">
        <div className="join-group-header-title">Logs</div>
      </div>

      <div className="Slide">
        <div className="slide-menu">
          <div className="sortBtn cursor" onClick={dubleSortMin}>{"<<"}</div>
          <div className="sortBtn cursor" onClick={sortMin}>{"<"}</div>
          <li className="sortBasc sortBtn">{state.sort}</li>
          <div className="sortBtn cursor" onClick={sortMax}>{">"}</div>
          <div className="sortBtn cursor" onClick={dubleSortMax}>{">>"}</div>
        </div>

        <div className="sortBtnList" onClick={toggleDropdown}>
          <div className="select-selected">
            {state.DubleList || 25} {/* Default value is 25 */}
          </div>
          <div className="select-items">
            <div onClick={(event) => handleSelect(event, 25)}>25</div>
            <div onClick={(event) => handleSelect(event, 100)}>100</div>
            <div onClick={(event) => handleSelect(event, 200)}>200</div>
          </div>
        </div>

        <div className="sortBtn colorRed">All count: {state.list}</div>
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
};

export default Logs;
