import { useState } from 'react'
import Sales from './sales'
import Home from './Home'
import CardPage from './pages/card'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {


  return (
    <BrowserRouter>
      {/* Header */}
      <div
        className="container-fluid bg-white"
        style={{ height: '103px', position: 'fixed', zIndex: 100 }}
      >
        <header className="row m-0 py-2">
          <div className="col-3 d-flex align-items-center">
            <strong>ERM</strong>
          </div>
          <div className="col-6">
            <input type="text" placeholder="Search" className="form-control" />
          </div>
          <div className="col-3"></div>
        </header>

        <header className="m-0 py-2 d-flex gap-2 border-bottom">
          <Link to="/product"> <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus"></i> Products
          </button></Link>
          <Link to="/order"> <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus"></i> Order
          </button></Link>
          <button className="btn btn-primary btn-sm">Reports</button>
          <button className="btn btn-primary btn-sm">Settings</button>
        </header>
      </div>

      {/* Sidebar + Main */}
      <div className="row m-0 p-0 box">
        {/* Sidebar */}
        <div className="col-2 card vh-100 sidebar-links-wrapper">
          <div style={{ height: '110px' }}></div>
          <a href="#"><i className="bi bi-house"></i> <span>Dashboard</span></a>
          <a href="#"><i className="bi bi-box"></i> <span>Layouts</span></a>
          <a href="#"><i className="bi bi-file"></i> <span>Pages</span></a>
          <a href="#"><i className="bi bi-app"></i> <span>Tables</span></a>
          <a href="#"><i className="bi bi-map"></i> <span>Map</span></a>
          <a href="#"><i className="bi bi-house"></i> <span>Departments</span></a>
          <a href="#"><i className="bi bi-hourglass"></i> <span>History</span></a>
        </div>

        {/* Main Content */}
        <div className="col-10 vh-100 bg-white" style={{ overflowY: 'scroll' }}>
          <div style={{ height: '100px' }}></div>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/sales' element={<Sales />}></Route>
            <Route path='/card' element={<CardPage />}></Route>
          </Routes>

        </div>
      </div>



    </BrowserRouter>
  )
}

export default App
