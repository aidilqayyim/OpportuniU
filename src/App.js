import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from "./components/Hero";
import Info from "./components/Info";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import SignIn from "./components/Signin";

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
      </Routes>
    </Router>
  );
}

export default App;
