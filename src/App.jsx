import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HypnoTeaExperience from './pages/HypnoTeaExperience';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/experience" element={<HypnoTeaExperience />} />
    </Routes>
  </BrowserRouter>
);

export default App;
