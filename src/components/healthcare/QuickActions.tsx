
import React from 'react';
import { Calendar, Pill, MessageCircle, FileText, Ambulance, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'appointments',
      title: 'Book Appointment',
      subtitle: 'Find doctors & book slots',
      icon: Calendar,
      color: 'gradient-primary',
      path: '/appointments'
    },
    {
      id: 'medicines',
      title: 'Order Medicines',
      subtitle: 'Upload prescription',
      icon: Pill,
      color: 'gradient-secondary',
      path: '/medicines'
    },
    {
      id: 'chat',
      title: 'Health Assistant',
      subtitle: '24/7 support chat',
      icon: MessageCircle,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      path: '/chat'
    },
    {
      id: 'records',
      title: 'Health Records',
      subtitle: 'Manage documents',
      icon: FileText,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      path: '/records'
    },
    {
      id: 'emergency',
      title: 'Emergency',
      subtitle: 'Ambulance & SOS',
      icon: Ambulance,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      path: '/emergency'
    },
    {
      id: 'reminders',
      title: 'Reminders',
      subtitle: 'Pills & appointments',
      icon: Bell,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      path: '/reminders'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => navigate(action.path)}
          className="group p-6 glass-card rounded-3xl hover-lift transition-smooth text-left"
        >
          <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-health-navy-800 dark:text-white mb-1">
            {action.title}
          </h3>
          <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
            {action.subtitle}
          </p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
