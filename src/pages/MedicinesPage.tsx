
import React from 'react';
import MedicineOrdering from '../components/healthcare/MedicineOrdering';

const MedicinesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 pt-20 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        <MedicineOrdering />
      </div>
    </div>
  );
};

export default MedicinesPage;
