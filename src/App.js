import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/:id" element={<Home />} />
          <Route exact path="/" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
