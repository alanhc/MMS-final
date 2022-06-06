import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home';
import Ticket from './containers/Ticket';

const App = () => {
  return (
    // <AuthContext.Provider value={{ authState, authDispatcher }}>
    //   <HeaderBar />
    //   <Collection />
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ticket/:id" element={<Ticket />} />
      </Routes>
      </Router>
    // </AuthContext.Provider>
  )
}

export default App;
