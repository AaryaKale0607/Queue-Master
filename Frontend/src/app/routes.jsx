// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Welcome from "../features/public/Welcome/Welcome";
// import LoginPage from "../features/auth/login/LoginPage";
// import SignUpPage from "../features/auth/signup/SignUpPage";
// import UserDashboard from "../features/user/pages/UserDashboard";
// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Welcome />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/UserDashboard" element={<UserDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;




import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "../features/public/Welcome/Welcome";
import About from "../features/public/Welcome/About";
import LoginPage from "../features/auth/login/LoginPage";
import SignUpPage from "../features/auth/signup/SignUpPage";
import UserDashboard from "../features/user/pages/UserDashboard";
import StaffDashboard from "../features/staff/pages/StaffDashboard";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import Hospitals from "../features/user/pages/HospitalList";
import DoctorList from "../features/user/pages/DoctorList";
import BankList from "../features/user/pages/BankList";
import BankServices from "../features/user/pages/BankServices";
import GovtOfficeList from "../features/user/pages/GovtOfficeList";
import GovernmentServices from "../features/user/pages/GovermentServices";
import Hotel from "../features/user/pages/HotelList";
import QueueStatus from "../features/user/pages/QueueStatus";
import TicketHistory from "../features/user/pages/TicketHistory";
import EstimatedWait from "../features/user/pages/EstimatedWait";
import Appointments from "../features/user/pages/Appointments";
import ViewQueue from "../features/staff/pages/ViewQueue";
import ManageCounters from "../features/admin/pages/ManageCounter";
import ServicesAndQueues from "../features/admin/pages/ServicesAndQueues";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/queue-status" element={<QueueStatus />} />
        <Route path="/ticket-history" element={<TicketHistory />} />
        <Route path="/estimated-wait" element={<EstimatedWait />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/view-queue" element={<ViewQueue />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-counters" element={<ManageCounters />} />
        <Route path="/admin/services-and-queues" element={<ServicesAndQueues />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:hospitalId/doctors" element={<DoctorList />} />
        <Route path="/banks" element={<BankList />} />
        <Route path="/banks/:bankName/services" element={<BankServices />} />
        <Route path="/government-offices" element={<GovtOfficeList />} />
        <Route path="/government-offices/:officeName/services" element={<GovernmentServices />} />
        <Route path="/hotels" element={<Hotel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
