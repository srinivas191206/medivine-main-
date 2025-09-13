import React, { useState, useEffect } from 'react';
import { 
  User, 
  Camera, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Plus, 
  X, 
  Check,
  Upload,
  Scissors
} from 'lucide-react';

const ProfileCreation = ({ user }) => {
  const [profileData, setProfileData] = useState({
    avatar: null,
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    height: '',
    weight: '',
    medicalConditions: [],
    allergies: [],
    medications: []
  });

  const [completionPercentage, setCompletionPercentage] = useState(30);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [step, setStep] = useState(1);

  const medicalConditionOptions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 
    'High Cholesterol', 'Thyroid Disorder', 'Depression', 'Anxiety'
  ];

  const allergyOptions = [
    'Penicillin', 'Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Soy', 
    'Tree Nuts', 'Wheat', 'Fish', 'Sesame'
  ];

  // Calculate completion percentage whenever profileData changes
  useEffect(() => {
    const calculateCompletion = () => {
      const fields = Object.entries(profileData);
      const completedFields = fields.filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== '' && value !== null;
      });
      
      const percentage = Math.round((completedFields.length / fields.length) * 100);
      setCompletionPercentage(percentage);
    };

    calculateCompletion();
  }, [profileData]);

  const handleInputChange = (field, value) => {
    console.log('Updating field:', field, 'with value:', value);
    setProfileData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('Updated profile data:', updated);
      return updated;
    });
  };

  const addTag = (field, value) => {
    if (value && !profileData[field].includes(value)) {
      handleInputChange(field, [...profileData[field], value]);
    }
  };

  const removeTag = (field, value) => {
    handleInputChange(field, profileData[field].filter(item => item !== value));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Avatar file selected:', file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('avatar', e.target.result);
        setShowImageCropper(true);
        console.log('Avatar uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log('Saving profile data:', {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone
    });
    // Here you would typically save to a backend or local storage
    alert('Profile saved successfully!');
  };

  const renderProgressBar = () => (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
          Profile Completion
        </h3>
        <span className="text-2xl font-bold text-health-teal-600">
          {completionPercentage}%
        </span>
      </div>
      <div className="relative">
        <div className="w-full bg-health-navy-200 dark:bg-health-navy-700 rounded-full h-3">
          <div 
            className="gradient-primary h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-health-navy-600 dark:text-health-navy-300 mt-2">
          <span>Getting Started</span>
          <span>Almost There</span>
          <span>Complete!</span>
        </div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-health-teal-400 to-health-mint-500 flex items-center justify-center overflow-hidden">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-white" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-10 h-10 gradient-primary rounded-full flex items-center justify-center cursor-pointer hover-lift transition-smooth">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        {showImageCropper && (
          <div className="mt-4 p-4 glass-card rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                Crop your photo
              </span>
              <button 
                onClick={() => setShowImageCropper(false)}
                className="p-2 gradient-primary rounded-xl hover-lift transition-smooth"
              >
                <Scissors className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Basic Information Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            First Name
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Last Name
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Gender
          </label>
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      {/* Physical Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Blood Type
          </label>
          <select
            value={profileData.bloodType}
            onChange={(e) => handleInputChange('bloodType', e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Height (cm)
          </label>
          <input
            type="number"
            value={profileData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
            placeholder="Enter height"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
            Weight (kg)
          </label>
          <input
            type="number"
            value={profileData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
            placeholder="Enter weight"
          />
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
          Medical Conditions
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {profileData.medicalConditions.map((condition, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-health-teal-100 text-health-teal-800 dark:bg-health-teal-900 dark:text-health-teal-200"
              >
                {condition}
                <button
                  onClick={() => removeTag('medicalConditions', condition)}
                  className="ml-2 text-health-teal-600 hover:text-health-teal-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {medicalConditionOptions
              .filter(condition => !profileData.medicalConditions.includes(condition))
              .map((condition, index) => (
                <button
                  key={index}
                  onClick={() => addTag('medicalConditions', condition)}
                  className="px-3 py-1 text-sm glass-card rounded-full hover-lift transition-smooth text-health-navy-700 dark:text-health-navy-300"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  {condition}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
          Allergies
        </h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {profileData.allergies.map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              >
                {allergy}
                <button
                  onClick={() => removeTag('allergies', allergy)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {allergyOptions
              .filter(allergy => !profileData.allergies.includes(allergy))
              .map((allergy, index) => (
                <button
                  key={index}
                  onClick={() => addTag('allergies', allergy)}
                  className="px-3 py-1 text-sm glass-card rounded-full hover-lift transition-smooth text-health-navy-700 dark:text-health-navy-300"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  {allergy}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {renderProgressBar()}

      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
              Complete Your Profile
            </h1>
            <p className="text-health-navy-600 dark:text-health-navy-300 mt-2">
              Help us provide you with personalized health insights
            </p>
          </div>
          <div className="flex space-x-2">
            {[1, 2].map((stepNumber) => (
              <button
                key={stepNumber}
                onClick={() => setStep(stepNumber)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-smooth ${
                  step === stepNumber
                    ? 'gradient-primary text-white'
                    : 'glass-card text-health-navy-600 dark:text-health-navy-300'
                }`}
              >
                {stepNumber}
              </button>
            ))}
          </div>
        </div>

        {step === 1 && renderBasicInfo()}
        {step === 2 && renderMedicalInfo()}

        <div className="flex justify-between mt-8 pt-6 border-t border-health-navy-200 dark:border-health-navy-600">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 glass-card rounded-xl hover-lift transition-smooth text-health-navy-700 dark:text-health-navy-300"
            >
              Previous
            </button>
          )}
          <div className="ml-auto">
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 gradient-primary text-white rounded-xl hover-lift hover-glow transition-smooth"
              >
                Continue
              </button>
            ) : (
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-3 gradient-primary text-white rounded-xl hover-lift hover-glow transition-smooth flex items-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Save Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
