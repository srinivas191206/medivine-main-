
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  Check, 
  AlertCircle, 
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

const DocumentUpload = () => {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    prescriptions: [
      { id: 1, name: 'Lisinopril_Prescription.pdf', size: '2.3 MB', status: 'uploaded', date: '2024-10-15' },
      { id: 2, name: 'Metformin_Prescription.pdf', size: '1.8 MB', status: 'uploaded', date: '2024-10-10' }
    ],
    labReports: [
      { id: 3, name: 'Blood_Test_Results.pdf', size: '4.1 MB', status: 'uploaded', date: '2024-10-12' },
      { id: 4, name: 'Cholesterol_Panel.pdf', size: '2.7 MB', status: 'processing', date: '2024-10-14' }
    ],
    insurance: [
      { id: 5, name: 'Insurance_Card_Front.jpg', size: '1.2 MB', status: 'uploaded', date: '2024-10-01' },
      { id: 6, name: 'Insurance_Card_Back.jpg', size: '1.1 MB', status: 'uploaded', date: '2024-10-01' }
    ]
  });

  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, color: 'health-teal' },
    { id: 'labReports', label: 'Lab Reports', icon: File, color: 'health-mint' },
    { id: 'insurance', label: 'Insurance', icon: Image, color: 'health-lavender' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    files.forEach(file => {
      // File validation
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Please upload PDF, JPG, or PNG files.`);
        return;
      }

      // Add file to the current tab
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'uploading',
        date: new Date().toISOString().split('T')[0]
      };

      setUploadedFiles(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newFile]
      }));

      // Simulate upload progress
      setTimeout(() => {
        setUploadedFiles(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].map(f => 
            f.id === newFile.id ? { ...f, status: 'uploaded' } : f
          )
        }));
      }, 2000);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(f => f.id !== fileId)
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-500 animate-bounce" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'uploading':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
            Medical Documents
          </h1>
          <p className="text-health-navy-600 dark:text-health-navy-300 max-w-2xl mx-auto">
            Upload and organize your medical documents securely. All files are encrypted and stored safely.
          </p>
        </div>
      </div>

      {/* Document Categories */}
      <div className="glass-card rounded-3xl p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-smooth ${
                activeTab === tab.id
                  ? 'gradient-primary text-white shadow-lg'
                  : 'glass-card text-health-navy-600 dark:text-health-navy-300 hover:bg-white/20 dark:hover:bg-black/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-health-teal-100 text-health-teal-700 dark:bg-health-teal-900 dark:text-health-teal-300'
              }`}>
                {uploadedFiles[tab.id].length}
              </span>
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-smooth ${
            dragOver
              ? 'border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20'
              : 'border-health-navy-300 dark:border-health-navy-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto gradient-secondary rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-health-navy-600 dark:text-health-navy-300 text-sm">
                Supports PDF, JPG, PNG files up to 10MB each
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 gradient-primary text-white rounded-xl hover-lift hover-glow transition-smooth inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Choose Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(Array.from(e.target.files))}
              className="hidden"
            />
          </div>
        </div>

        {/* File List */}
        <div className="mt-6 space-y-4">
          {uploadedFiles[activeTab].length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Uploaded Files ({uploadedFiles[activeTab].length})
              </h3>
              <div className="grid gap-4">
                {uploadedFiles[activeTab].map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 neuro rounded-2xl hover-lift transition-smooth"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                        {getStatusIcon(file.status)}
                      </div>
                      <div>
                        <h4 className="font-medium text-health-navy-800 dark:text-white">
                          {file.name}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-health-navy-600 dark:text-health-navy-300">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.date}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(file.status)}`}
                          >
                            {file.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-health-teal-50 dark:hover:bg-health-teal-900/20 rounded-xl transition-smooth">
                        <Eye className="w-5 h-5 text-health-teal-500" />
                      </button>
                      <button className="p-2 hover:bg-health-teal-50 dark:hover:bg-health-teal-900/20 rounded-xl transition-smooth">
                        <Download className="w-5 h-5 text-health-teal-500" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-smooth"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto gradient-secondary rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-2">
                No files in this category yet
              </h3>
              <p className="text-health-navy-600 dark:text-health-navy-300">
                Upload your first {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} document
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
          Upload Tips
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-health-navy-800 dark:text-white">High Quality</h4>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Ensure documents are clear and readable
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-health-navy-800 dark:text-white">Organize</h4>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Use the correct category for each document
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-health-navy-800 dark:text-white">Secure</h4>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                All files are encrypted and HIPAA compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
