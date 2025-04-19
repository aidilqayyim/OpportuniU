import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from "./components/Hero";
import Info from "./components/Info";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import SignIn from "./components/Signin";
import Signup from "./components/SignUp";
import Joblistings from "./components/Joblistings"
import AboutUs from "./components/AboutUs";
import Profile from "./components/Profile";
import Postsignup from "./components/Postsignup";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Info />
              <Cards />
              <Footer />
            </>
          }
        />
        <Route 
          path="/signin"
          element={
            <SignIn />
          }
        />
        <Route 
          path="/signup"
          element={
            <Signup />
          }
        />
        <Route 
        path="/joblistings"
        element={
          <>
            <Navbar />
            <Joblistings />
            <Footer />
          </>
        }
        />
        <Route 
        path="/aboutus"
        element={
          <>
            <Navbar />
            <AboutUs />
            <Footer />
          </>
        }
        />
        <Route 
        path="/profile"
        element={
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
          }
        />
        <Route
        path="/postsignin"
        element={
          <Postsignup />
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
