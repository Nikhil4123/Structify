import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrganizationPage from "./page/OrganizationPage";
import OrganizationDetails from "./page/OrganizationDetails";
import MemberForm from "./page/MemberForm";
import TeamFormPage from "./page/TeamFormPage";
import AddImage from "./page/AddImage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrganizationPage />} />
        <Route path="/organizations/:orgId" element={<OrganizationDetails />} />
        <Route path="/teamForm" element={<TeamFormPage />} />
        <Route path="/memberForm" element={<MemberForm />} />
        <Route path="/addImage/:memberId" element={<AddImage />} />


      </Routes>
    </Router>
  );
}

export default App;
