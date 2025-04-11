import Main from './landing/main';
import Login from './login';
import Signup from './signup';
import PatientDashboard from './patient/dashboard';
import UploadPrescriptions from './patient/UploadPrescription';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'antd/dist/reset.css'; // for Ant Design v5+

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/patientdashboard' element={<PatientDashboard></PatientDashboard>}></Route>
      <Route path='/uploadpre' element={<UploadPrescriptions></UploadPrescriptions>}></Route>
      
    </Routes>
    </BrowserRouter>
  );
}

export default App;
