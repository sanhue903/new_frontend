import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/Login';
import MainView from './views/MainView';
import ProtectedRoute from './components/ProtectedRoute';
import StudentView from './views/StudentView';
import Register from './views/Register'
import './App.css';

function App() { 
  return (
  <div>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register/>} />
      <Route path="/students" element={<ProtectedRoute><MainView /></ProtectedRoute>} />
      <Route path="/students/:studentId/scores" element={<ProtectedRoute><StudentView /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App
