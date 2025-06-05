// src/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

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
