import { Routes, Route } from 'react-router-dom';
import ShortenPage from './pages/ShortenPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShortenPage />} />
    </Routes>
  );
}

export default App;
