import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone,
  Lock,
  Trash2,
  Download,
  Camera,
  Mail,
  Phone,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

const SettingsPanel = ({ toggleTheme, darkMode }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    appointments: true,
    reminders: true,
    results: false,
    marketing: false,
    push: true,
    email: true,
    sms: false
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'account', label: 'Account', icon: Lock }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    console.log(`Notification ${key} toggled to:`, !notifications[key]);
  };

  const handleProfileSave = () => {
    console.log('Saving profile data:', profileData);
    alert('Profile updated successfully!');
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Avatar file selected:', file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Avatar uploaded successfully');
        alert('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    console.log('Avatar removed');
    alert('Profile photo removed!');
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    console.log('Password changed successfully');
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
  };

  const handleDataDownload = () => {
    console.log('Downloading user data...');
    const data = {
      profile: profileData,
      notifications: notifications,
      settings: { darkMode, language, biometricEnabled },
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-health-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Your data has been downloaded!');
  };

  const handleAccountDeactivation = () => {
    console.log('Account deactivation requested');
    alert('Account deactivation request submitted. You will receive an email with further instructions.');
  };

  const handleAccountDeletion = () => {
    console.log('Account deletion requested');
    alert('Account deletion initiated. This action cannot be undone. You will receive a confirmation email.');
    setShowDeleteConfirm(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    console.log('Language changed to:', newLanguage);
    alert(`Language changed to ${languages.find(l => l.code === newLanguage)?.name}!`);
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
          Profile Information
        </h3>
        
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-health-teal-400 to-health-mint-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <label className="absolute bottom-0 right-0 w-7 h-7 gradient-primary rounded-full flex items-center justify-center hover-lift transition-smooth cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-health-navy-800 dark:text-white">
              Update Profile Photo
            </h4>
            <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
              Choose a photo that represents you
            </p>
            <div className="flex space-x-2">
              <label className="px-3 py-1 text-sm gradient-primary text-white rounded-lg hover-lift transition-smooth cursor-pointer">
                Upload New
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              <button 
                onClick={handleAvatarRemove}
                className="px-3 py-1 text-sm glass-card text-health-navy-700 dark:text-health-navy-300 rounded-lg hover-lift transition-smooth"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
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
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
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
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleProfileSave}
          className="px-6 py-3 gradient-primary text-white rounded-xl hover-lift hover-glow transition-smooth"
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <p className="text-health-navy-600 dark:text-health-navy-300 text-sm mb-6">
          Choose how you want to be notified about important health updates
        </p>
      </div>

      {/* Notification Categories */}
      <div className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium text-health-navy-800 dark:text-white">
            Health Notifications
          </h4>
          
          {[
            { key: 'appointments', label: 'Appointment Reminders', desc: 'Get notified before your appointments' },
            { key: 'reminders', label: 'Medication Reminders', desc: 'Reminders to take your medications' },
            { key: 'results', label: 'Test Results', desc: 'When your lab results are ready' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 neuro rounded-2xl">
              <div>
                <h5 className="font-medium text-health-navy-800 dark:text-white">
                  {item.label}
                </h5>
                <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                  {item.desc}
                </p>
              </div>
              <button
                onClick={() => handleNotificationToggle(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
                  notifications[item.key] ? 'bg-health-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-health-navy-800 dark:text-white">
            Communication Channels
          </h4>
          
          {[
            { key: 'push', label: 'Push Notifications', desc: 'Notifications on your device', icon: Smartphone },
            { key: 'email', label: 'Email Notifications', desc: 'Notifications via email', icon: Mail },
            { key: 'sms', label: 'SMS Notifications', desc: 'Text message notifications', icon: Phone }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 neuro rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h5 className="font-medium text-health-navy-800 dark:text-white">
                    {item.label}
                  </h5>
                  <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    {item.desc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleNotificationToggle(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
                  notifications[item.key] ? 'bg-health-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
          Privacy & Security
        </h3>
        <p className="text-health-navy-600 dark:text-health-navy-300 text-sm mb-6">
          Control your privacy settings and secure your account
        </p>
      </div>

      <div className="space-y-4">
        {/* Biometric Authentication */}
        <div className="flex items-center justify-between p-4 neuro rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="font-medium text-health-navy-800 dark:text-white">
                Biometric Authentication
              </h5>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Use Face ID or Fingerprint to unlock
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setBiometricEnabled(!biometricEnabled);
              console.log('Biometric authentication:', !biometricEnabled ? 'enabled' : 'disabled');
              alert(`Biometric authentication ${!biometricEnabled ? 'enabled' : 'disabled'}!`);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
              biometricEnabled ? 'bg-health-teal-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                biometricEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Security Options */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="w-full flex items-center justify-between p-4 neuro rounded-2xl hover-lift transition-smooth"
          >
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-health-navy-600 dark:text-health-navy-300" />
              <span className="font-medium text-health-navy-800 dark:text-white">
                Change Password
              </span>
            </div>
            <span className="text-health-teal-600">→</span>
          </button>

          {showPasswordChange && (
            <div className="p-4 glass-card rounded-2xl space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handlePasswordChange}
                  className="px-4 py-2 gradient-primary text-white rounded-xl hover-lift transition-smooth"
                >
                  Update Password
                </button>
                <button 
                  onClick={() => setShowPasswordChange(false)}
                  className="px-4 py-2 glass-card text-health-navy-700 dark:text-health-navy-300 rounded-xl hover-lift transition-smooth"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={handleDataDownload}
            className="w-full flex items-center justify-between p-4 neuro rounded-2xl hover-lift transition-smooth"
          >
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-health-navy-600 dark:text-health-navy-300" />
              <span className="font-medium text-health-navy-800 dark:text-white">
                Download My Data
              </span>
            </div>
            <span className="text-health-teal-600">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 neuro rounded-2xl hover-lift transition-smooth">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-health-navy-600 dark:text-health-navy-300" />
              <span className="font-medium text-health-navy-800 dark:text-white">
                Privacy Policy
              </span>
            </div>
            <span className="text-health-teal-600">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
          Preferences
        </h3>
        <p className="text-health-navy-600 dark:text-health-navy-300 text-sm mb-6">
          Customize your app experience
        </p>
      </div>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 neuro rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              {darkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h5 className="font-medium text-health-navy-800 dark:text-white">
                Dark Mode
              </h5>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Switch between light and dark theme
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${
              darkMode ? 'bg-health-teal-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Language Selection */}
        <div className="p-4 neuro rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="font-medium text-health-navy-800 dark:text-white">
                Language
              </h5>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Choose your preferred language
              </p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
          Account Management
        </h3>
        <p className="text-health-navy-600 dark:text-health-navy-300 text-sm mb-6">
          Manage your account settings and data
        </p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleDataDownload}
          className="w-full flex items-center justify-between p-4 neuro rounded-2xl hover-lift transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-health-navy-600 dark:text-health-navy-300" />
            <div className="text-left">
              <h5 className="font-medium text-health-navy-800 dark:text-white">
                Export Data
              </h5>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Download all your health data
              </p>
            </div>
          </div>
          <span className="text-health-teal-600">→</span>
        </button>

        <button 
          onClick={handleAccountDeactivation}
          className="w-full flex items-center justify-between p-4 neuro rounded-2xl hover-lift transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-health-navy-600 dark:text-health-navy-300" />
            <div className="text-left">
              <h5 className="font-medium text-health-navy-800 dark:text-white">
                Deactivate Account
              </h5>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Temporarily disable your account
              </p>
            </div>
          </div>
          <span className="text-health-teal-600">→</span>
        </button>

        {/* Delete Account */}
        <div className="p-4 neuro rounded-2xl border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="font-medium text-red-800 dark:text-red-300">
                Danger Zone
              </h5>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all data
              </p>
            </div>
          </div>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-smooth"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleAccountDeletion}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-smooth flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 glass-card text-health-navy-700 dark:text-health-navy-300 rounded-xl hover-lift transition-smooth"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
              Settings
            </h1>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Manage your account preferences and privacy settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-3xl p-4 sticky top-24">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-smooth text-left ${
                    activeSection === section.id
                      ? 'gradient-primary text-white shadow-lg'
                      : 'text-health-navy-600 dark:text-health-navy-300 hover:bg-white/20 dark:hover:bg-black/20'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-3xl p-6 md:p-8">
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'notifications' && renderNotifications()}
            {activeSection === 'privacy' && renderPrivacy()}
            {activeSection === 'preferences' && renderPreferences()}
            {activeSection === 'account' && renderAccount()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
