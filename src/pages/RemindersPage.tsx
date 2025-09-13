
import React, { useState } from 'react';
import { Bell, Clock, Pill, Calendar, Plus, Edit, Trash2 } from 'lucide-react';

const RemindersPage = () => {
  const [reminders] = useState([
    {
      id: 1,
      type: 'medicine',
      title: 'Paracetamol 500mg',
      time: '08:00 AM',
      frequency: 'Daily',
      nextDue: '2024-01-16 08:00',
      active: true
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Dr. Rajesh Kumar - Cardiology',
      time: '02:00 PM',
      frequency: 'One-time',
      nextDue: '2024-01-18 14:00',
      active: true
    },
    {
      id: 3,
      type: 'medicine',
      title: 'Amoxicillin 250mg',
      time: '12:00 PM',
      frequency: 'Twice daily',
      nextDue: '2024-01-16 12:00',
      active: true
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 pt-20 pb-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
            Reminders
          </h1>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            Never miss your medicines or appointments
          </p>
        </div>

        {/* Add New Reminder */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
              Add New Reminder
            </h2>
            <button className="px-4 py-2 gradient-primary text-white rounded-xl hover-lift transition-smooth flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-health-teal-300 rounded-2xl hover:border-health-teal-500 transition-smooth text-center">
              <Pill className="w-8 h-8 text-health-teal-600 mx-auto mb-2" />
              <h3 className="font-semibold text-health-navy-800 dark:text-white">Medicine Reminder</h3>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">Set pill reminders</p>
            </button>

            <button className="p-4 border-2 border-dashed border-health-mint-300 rounded-2xl hover:border-health-mint-500 transition-smooth text-center">
              <Calendar className="w-8 h-8 text-health-mint-600 mx-auto mb-2" />
              <h3 className="font-semibold text-health-navy-800 dark:text-white">Appointment Reminder</h3>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">Set appointment alerts</p>
            </button>
          </div>
        </div>

        {/* Active Reminders */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-6">
            Active Reminders ({reminders.filter(r => r.active).length})
          </h2>

          <div className="space-y-4">
            {reminders.filter(r => r.active).map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    reminder.type === 'medicine' 
                      ? 'gradient-primary' 
                      : 'bg-gradient-to-r from-health-mint-500 to-health-mint-600'
                  }`}>
                    {reminder.type === 'medicine' ? (
                      <Pill className="w-6 h-6 text-white" />
                    ) : (
                      <Calendar className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-health-navy-800 dark:text-white">
                      {reminder.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-health-navy-600 dark:text-health-navy-300">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{reminder.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bell className="w-4 h-4" />
                        <span>{reminder.frequency}</span>
                      </div>
                    </div>
                    <div className="text-xs text-health-teal-600 mt-1">
                      Next: {new Date(reminder.nextDue).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-health-navy-600 dark:text-health-navy-300 hover:bg-health-navy-50 dark:hover:bg-health-navy-800/20 rounded-xl transition-smooth">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-smooth">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-6">
            Today's Schedule
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-health-teal-50 dark:bg-health-teal-900/20 rounded-xl border-l-4 border-health-teal-500">
              <div className="flex items-center space-x-3">
                <Pill className="w-5 h-5 text-health-teal-600" />
                <span className="font-medium text-health-navy-800 dark:text-white">Paracetamol 500mg</span>
              </div>
              <span className="text-sm text-health-teal-600 font-medium">08:00 AM</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-health-mint-50 dark:bg-health-mint-900/20 rounded-xl border-l-4 border-health-mint-500">
              <div className="flex items-center space-x-3">
                <Pill className="w-5 h-5 text-health-mint-600" />
                <span className="font-medium text-health-navy-800 dark:text-white">Amoxicillin 250mg</span>
              </div>
              <span className="text-sm text-health-mint-600 font-medium">12:00 PM</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-health-lavender-50 dark:bg-health-lavender-900/20 rounded-xl border-l-4 border-health-lavender-500">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-health-lavender-600" />
                <span className="font-medium text-health-navy-800 dark:text-white">Dr. Rajesh Kumar - Cardiology</span>
              </div>
              <span className="text-sm text-health-lavender-600 font-medium">02:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
