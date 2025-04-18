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
      </Routes>
    </Router>
  );
}

export default App;
