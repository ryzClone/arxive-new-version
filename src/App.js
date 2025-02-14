import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Transfer from './components/Transfer';
import Adduser from './components/Adduser';
import './style/app.css';
import LoginPage from './components/loginpage';
import Group from './components/Group';
import NoPage from './components/Nopage';
import JoinGroup from './components/JoinGroup';
import ReadUser from './components/readUser';
import AddUserJoin from './components/Addjoingroup';
import AddGroup from './components/AddGroup';
import Service from './components/Service';
import AddService from './components/AddService';
import History from './components/history';
import SubFolder from './Folders/SubFolder';
import Logs from './Folders/Logs';
import Folders from './Folders/Folder';
import Search from './components/Search';
import Contracts from './components/Contracts';

export default function App() {
  return (

    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Layout />}>
        <Route index element={<Folders />} />
        <Route path="/home/readuser/" element={<ReadUser />} />
        <Route path="/home/subfolder" element={<SubFolder />} />
        <Route path="/home/logs" element={<Logs />} />
        <Route path="/home/readuser/adduser" element={<Adduser />} />
        <Route path="/home/transfer" element={<Transfer />} />
        <Route path="/home/group" element={<Group />} />
        <Route path="/home/group/addgroup" element={<AddGroup />} />
        <Route path="/home/service" element={<Service />} />
        <Route path="/home/service/addservice" element={<AddService />} />
        <Route path="/home/joingroup" element={<JoinGroup />} />
        <Route path="/home/joingroup/adduserjoin" element={<AddUserJoin />} />
        <Route path="/home/history" element={<History />} />
        <Route path="/home/contracts" element={<Contracts />} />
        <Route path="/home/search" element={<Search />} />
        <Route path="/home/*" element={<NoPage />} />
      </Route>
    </Routes>
  )
}      
