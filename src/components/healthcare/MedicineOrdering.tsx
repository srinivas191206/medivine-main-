
import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MedicineOrdering = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showFileTypePrompt, setShowFileTypePrompt] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);



  const handleFileUpload = () => {
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image (JPG, PNG) or PDF file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB.');
      return;
    }

    setUploadedFile(file);
    setShowFileTypePrompt(true);
    setError('');
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileTypeSelection = (type) => {
    setFileType(type);
    setShowFileTypePrompt(false);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFileType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
          Order Medicines
        </h1>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Upload prescription or search medicines directly
        </p>
      </div>

      {/* Prescription Upload Options */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-4">
          How would you like to order?
        </h2>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={handleFileUpload}
            className="w-full p-8 rounded-2xl border-2 border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20 transition-smooth hover:scale-105"
          >
            <Upload className="w-12 h-12 text-health-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-health-navy-800 dark:text-white mb-2">Upload Prescription</h3>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Take photo or select file (PDF/Image)
            </p>
          </button>

          <button
            onClick={() => navigate('/medicines/search')}
            className="w-full p-8 rounded-2xl border-2 border-health-navy-200 dark:border-health-navy-600 transition-smooth hover:scale-105 hover:border-health-teal-500 hover:bg-health-teal-50 dark:hover:bg-health-teal-900/20"
          >
            <Search className="w-12 h-12 text-health-teal-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-health-navy-800 dark:text-white mb-2">Search Medicine</h3>
            <p className="text-health-navy-600 dark:text-health-navy-300">Find directly without prescription</p>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Error message */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* File type prompt modal */}
        {showFileTypePrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-health-navy-800 rounded-3xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
                File Type Confirmation
              </h3>
              <p className="text-health-navy-600 dark:text-health-navy-300 mb-6">
                Is this file a PDF document or an image?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleFileTypeSelection('pdf')}
                  className="p-4 rounded-2xl border-2 border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20 hover:scale-105 transition-smooth"
                >
                  <FileText className="w-8 h-8 text-health-teal-600 mx-auto mb-2" />
                  <span className="font-semibold text-health-navy-800 dark:text-white">PDF</span>
                </button>
                <button
                  onClick={() => handleFileTypeSelection('image')}
                  className="p-4 rounded-2xl border-2 border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20 hover:scale-105 transition-smooth"
                >
                  <Upload className="w-8 h-8 text-health-teal-600 mx-auto mb-2" />
                  <span className="font-semibold text-health-navy-800 dark:text-white">Image</span>
                </button>
              </div>
              <button
                onClick={() => setShowFileTypePrompt(false)}
                className="w-full mt-4 py-2 text-health-navy-600 dark:text-health-navy-300 hover:text-health-navy-800 dark:hover:text-white transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Uploaded file display */}
        {uploadedFile && fileType && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {fileType === 'pdf' ? (
                  <FileText className="w-8 h-8 text-green-600" />
                ) : (
                  <Upload className="w-8 h-8 text-green-600" />
                )}
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-400">
                    {uploadedFile.name}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    {fileType.toUpperCase()} • {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeUploadedFile}
                className="px-3 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-smooth"
              >
                Remove
              </button>
            </div>
            <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✅ Prescription uploaded successfully! Our pharmacist will review and prepare your medicines.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineOrdering;
