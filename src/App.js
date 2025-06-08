// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../src/Layout';

// import for student part
import Hero from "../src/components/student/Hero";
import Info from "../src/components/student/Info";
import Cards from "../src/components/student/Cards";
import SignIn from "../src/components/student/Signin";
import Signup from "../src/components/student/SignUp";
import Postsignup from "../src/components/student/Postsignup";
import Joblistings from "../src/components/student/Joblistings";
import AboutUs from "../src/components/student/AboutUs";
import Profile from "../src/components/student/Profile";
import JobDescription from "../src/components/student/JobDescription"; // if you’ve created this

// import for organiser part
import SigninOrg from "../src/components/organiser/Signin"
import SignUpOrg from './components/organiser/SignUp';
import PostsignupOrg from './components/organiser/Postsignup';
import LayoutOrg from "../src/LayoutOrg";
import HeroOrg from "../src/components/organiser/Hero";
import InfoOrg from "../src/components/organiser/Info";
import CardsOrg from "../src/components/organiser/Cards";
import ProfileOrg from "../src/components/organiser/Profile";
import AddJobs from './components/organiser/AddJobs';
import MyListings from './components/organiser/MyListings';
import JobDescriptionOrg from './components/organiser/JobDescription';
import CheckApplications from './components/organiser/CheckApplications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student part */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/postsignin" element={<Postsignup />} />

        {/* Organiser part */}
        <Route path="/signin/organiser" element={<SigninOrg />} />
        <Route path="/signup/organiser" element={<SignUpOrg />} />
        <Route path="/organiser/postsignin" element={<PostsignupOrg />} />
        

        {/* Layout for student */}
        <Route element={<Layout />}>
          <Route path="/" element={
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
        
        {/* Layout for organiser */}
        <Route element={<LayoutOrg />}>
          <Route path="/organiser/" element={
              <>
                <HeroOrg />
                <InfoOrg />
                <CardsOrg />
              </>
            }
          />
          <Route path="/organiser/mylistings" element={<MyListings />} />
          <Route path="/organiser/addjobs" element={<AddJobs />} />
          <Route path="/organiser/profile" element={<ProfileOrg />} />
          <Route path="/organiser/jobdesc" element={<JobDescriptionOrg />} />
          <Route path="/organiser/checkapplications" element={<CheckApplications />} />

        </Route>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
