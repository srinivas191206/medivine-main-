
import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Calendar, User, Tag } from 'lucide-react';

const RecordsPage = () => {
  const [records] = useState([
    {
      id: 1,
      name: 'Blood Test Report',
      type: 'Lab Report',
      date: '2024-01-15',
      doctor: 'Dr. Rajesh Kumar',
      category: 'Blood Work',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'X-Ray Chest',
      type: 'Imaging',
      date: '2024-01-10',
      doctor: 'Dr. Priya Sharma',
      category: 'Radiology',
      size: '5.1 MB'
    },
    {
      id: 3,
      name: 'Prescription',
      type: 'Prescription',
      date: '2024-01-05',
      doctor: 'Dr. Amit Patel',
      category: 'Medicine',
      size: '0.8 MB'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 pt-20 pb-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
            Health Records
          </h1>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            Manage your medical documents and reports
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-4">
            Upload New Document
          </h2>
          <div className="border-2 border-dashed border-health-teal-300 rounded-2xl p-8 text-center">
            <Upload className="w-12 h-12 text-health-teal-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-2">
              Upload Your Medical Records
            </h3>
            <p className="text-health-navy-600 dark:text-health-navy-300 mb-4">
              Support for PDF, JPG, PNG files up to 10MB
            </p>
            <button className="px-6 py-3 gradient-primary text-white rounded-2xl hover-lift transition-smooth">
              Choose Files
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
              Your Records ({records.length})
            </h2>
            <div className="flex space-x-2">
              <select className="px-4 py-2 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500">
                <option>All Categories</option>
                <option>Lab Reports</option>
                <option>Imaging</option>
                <option>Prescriptions</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl hover-lift transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-health-navy-800 dark:text-white">
                      {record.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-health-navy-600 dark:text-health-navy-300">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{record.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{record.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{record.doctor}</span>
                      </div>
                    </div>
                    <div className="text-xs text-health-navy-500 mt-1">
                      Size: {record.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-health-teal-600 hover:bg-health-teal-50 dark:hover:bg-health-teal-900/20 rounded-xl transition-smooth">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-health-navy-600 dark:text-health-navy-300 hover:bg-health-navy-50 dark:hover:bg-health-navy-800/20 rounded-xl transition-smooth">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-smooth">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-health-teal-600 mb-1">12</div>
            <div className="text-sm text-health-navy-600 dark:text-health-navy-300">Total Records</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-health-mint-600 mb-1">5</div>
            <div className="text-sm text-health-navy-600 dark:text-health-navy-300">Lab Reports</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-health-lavender-600 mb-1">4</div>
            <div className="text-sm text-health-navy-600 dark:text-health-navy-300">Prescriptions</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-health-navy-600 mb-1">3</div>
            <div className="text-sm text-health-navy-600 dark:text-health-navy-300">Imaging</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
