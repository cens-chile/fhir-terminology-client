import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CodeSystemPage from './pages/CodeSystemPage';

/*
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/codesystem" element={<CodeSystemPage />} />
    </Routes>
  </Router>
);
*/
function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}
export default App;
