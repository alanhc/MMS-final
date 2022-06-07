import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home';
import Ticket from './containers/Ticket';
import Scan from './containers/Scan';

const App = () => {
  return (
      <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/scan/:id" element={<Scan />} />
      </Routes>
      </Router>
  )
}

export default App;
