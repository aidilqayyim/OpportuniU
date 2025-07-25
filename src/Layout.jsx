// src/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../src/components/student/Navbar';
import Footer from '../src/components/student/Footer';

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
