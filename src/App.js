// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../src/Layout';

import Hero from "../src/components/Hero";
import Info from "../src/components/Info";
import Cards from "../src/components/Cards";
import SignIn from "../src/components/Signin";
import Signup from "../src/components/SignUp";
import Postsignup from "../src/components/Postsignup";
import Joblistings from "../src/components/Joblistings";
import AboutUs from "../src/components/AboutUs";
import Profile from "../src/components/Profile";
import JobDescription from "../src/components/JobDescription"; // if you’ve created this

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public standalone routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/postsignin" element={<Postsignup />} />

        {/* Routes with shared layout (Navbar + Footer) */}
        <Route element={<Layout />}>

          <Route
            path="/"
            element={
              <>
                <Hero />
                <Info />
                <Cards />
              </>
            }
          />

          <Route path="/joblistings" element={<Joblistings />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobdesc" element={<JobDescription />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
