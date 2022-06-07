import { useEffect, useReducer, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home';
import Ticket from './containers/Ticket';
import Scan from './containers/Scan';

const App = () => {
  return (
      <Router>
        <Routes>
          <Route exact path="/*" element={<Home/>} />
          <Route exact path="/ticket/:id" element={<Ticket />} />
          <Route exact path="/scan/:id" element={<Scan />} />
        </Routes>
      </Router>
  )
}

export default App;
