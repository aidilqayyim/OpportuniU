// src/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/organiser/Navbar';
import Footer from './components/organiser/Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
