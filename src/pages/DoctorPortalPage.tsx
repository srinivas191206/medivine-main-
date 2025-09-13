
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import DoctorRegistration from '../components/doctor/DoctorRegistration';
import DoctorAppointments from '../components/doctor/DoctorAppointments';
import DoctorAvailability from '../components/doctor/DoctorAvailability';
import DoctorEarnings from '../components/doctor/DoctorEarnings';
import DoctorDocuments from '../components/doctor/DoctorDocuments';

const DoctorPortalPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 pt-20 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<DoctorDashboard />} />
          <Route path="/register" element={<DoctorRegistration />} />
          <Route path="/appointments" element={<DoctorAppointments />} />
          <Route path="/availability" element={<DoctorAvailability />} />
          <Route path="/earnings" element={<DoctorEarnings />} />
          <Route path="/documents" element={<DoctorDocuments />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorPortalPage;
