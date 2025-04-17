import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from "./components/Hero";
import Info from "./components/Info";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
<<<<<<< HEAD
import SignIn from "./components/Signin";
=======
>>>>>>> 9c87ee4c74e7620e694e015e7ce163d5b7d65336

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
<<<<<<< HEAD
        <Route 
          path="/signin"
          element={
            <SignIn />
          }
        />
=======
>>>>>>> 9c87ee4c74e7620e694e015e7ce163d5b7d65336
      </Routes>
    </Router>
  );
}

export default App;
