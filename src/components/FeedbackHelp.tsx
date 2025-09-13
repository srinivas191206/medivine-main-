import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Heart, 
  Meh, 
  Frown, 
  Smile, 
  Send, 
  Upload, 
  Phone, 
  Mail, 
  MessageCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';

const FeedbackHelp = () => {
  const [activeTab, setActiveTab] = useState('feedback');
  const [rating, setRating] = useState<number>(0); // Fixed: explicitly typed as number
  const [hoverRating, setHoverRating] = useState<number>(0); // Fixed: explicitly typed as number
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 1,
      title: 'Cannot upload lab results',
      status: 'resolved',
      date: '2024-10-15',
      response: 'Issue has been resolved. Please try uploading again.'
    },
    {
      id: 2,
      title: 'Appointment reminder not working',
      status: 'pending',
      date: '2024-10-14',
      response: null
    }
  ]);

  const tabs = [
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'support', label: 'Support', icon: MessageCircle }
  ];

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'health-teal' },
    { id: 'bug', label: 'Report Bug', icon: Bug, color: 'red' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'health-mint' },
    { id: 'help', label: 'Need Help', icon: HelpCircle, color: 'health-lavender' }
  ];

  const emojiRatingScale = [
    { value: 1, emoji: '😢', label: 'Terrible', color: 'text-red-500' },
    { value: 2, emoji: '😟', label: 'Bad', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😍', label: 'Excellent', color: 'text-health-teal-500' }
  ];

  const faqs = [
    {
      question: 'How do I upload my medical documents?',
      answer: 'Go to the Documents section, select the appropriate category, and drag & drop your files or click to upload. We support PDF, JPG, and PNG files up to 10MB.',
      category: 'Documents'
    },
    {
      question: 'How can I schedule an appointment?',
      answer: 'Use the Booking section to find available doctors, select a time slot, and confirm your appointment. You\'ll receive a confirmation email and reminder notifications.',
      category: 'Appointments'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Yes, all your health data is encrypted and stored securely. We are HIPAA compliant and follow strict privacy protocols to protect your information.',
      category: 'Privacy'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile section where you can edit your personal information, medical conditions, allergies, and emergency contacts.',
      category: 'Profile'
    },
    {
      question: 'Can I export my health data?',
      answer: 'Yes, you can download all your health data from the Settings > Account section. We provide your data in a standard format for easy transfer.',
      category: 'Data'
    }
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !feedbackText.trim()) return;
    
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setFeedbackText('');
        setFeedbackType('general');
      }, 3000);
    }, 500);
  };

  const renderFeedback = () => (
    <div className="space-y-6">
      {!submitted ? (
        <>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
              We'd Love Your Feedback
            </h2>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Help us improve your healthcare experience
            </p>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                What type of feedback is this?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id)}
                    className={`p-4 rounded-2xl border-2 transition-smooth ${
                      feedbackType === type.id
                        ? 'border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20'
                        : 'border-health-navy-200 dark:border-health-navy-600 glass-card'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                      feedbackType === type.id ? 'text-health-teal-600' : 'text-health-navy-600 dark:text-health-navy-300'
                    }`} />
                    <span className={`text-sm font-medium ${
                      feedbackType === type.id ? 'text-health-teal-700 dark:text-health-teal-300' : 'text-health-navy-700 dark:text-health-navy-300'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Rating */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                How would you rate your experience?
              </h3>
              <div className="flex justify-center space-x-2">
                {emojiRatingScale.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRating(item.value)}
                    onMouseEnter={() => setHoverRating(item.value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`p-4 rounded-2xl transition-smooth ${
                      (hoverRating >= item.value || rating >= item.value)
                        ? 'glass-card scale-110 shadow-lg'
                        : 'hover:glass-card hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <div className={`text-sm font-medium ${item.color}`}>
                        {item.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Feedback */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Tell us more about your experience
              </h3>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report any issues..."
                rows={6}
                className="w-full px-4 py-3 glass-card rounded-2xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth resize-none"
                required
              />
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Attach Screenshot (Optional)
              </h3>
              <div className="border-2 border-dashed border-health-navy-300 dark:border-health-navy-600 rounded-2xl p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-health-navy-400" />
                <p className="text-health-navy-600 dark:text-health-navy-300 text-sm">
                  Click to upload or drag and drop
                </p>
                <p className="text-health-navy-400 text-xs mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={rating === 0 || !feedbackText.trim()}
              className="w-full py-4 gradient-primary text-white rounded-2xl font-semibold hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span>Submit Feedback</span>
            </button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6 py-12 animate-scale-in">
          <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
              Thank You!
            </h2>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Your feedback helps us improve the experience for everyone.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
          Help Center
        </h2>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Find answers to common questions
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full pl-10 pr-4 py-3 glass-card rounded-2xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
        />
      </div>

      {/* FAQ Categories */}
      <div className="grid md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="neuro rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-health-navy-800 dark:text-white pr-4">
                {faq.question}
              </h3>
              <span className="text-xs px-2 py-1 bg-health-teal-100 text-health-teal-700 dark:bg-health-teal-900 dark:text-health-teal-300 rounded-full flex-shrink-0">
                {faq.category}
              </span>
            </div>
            <p className="text-health-navy-600 dark:text-health-navy-300 text-sm">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button className="p-6 glass-card rounded-2xl hover-lift transition-smooth text-center">
          <MessageCircle className="w-8 h-8 mx-auto mb-3 text-health-teal-500" />
          <h3 className="font-semibold text-health-navy-800 dark:text-white mb-2">
            Live Chat
          </h3>
          <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
            Chat with our support team
          </p>
        </button>
        
        <button className="p-6 glass-card rounded-2xl hover-lift transition-smooth text-center">
          <Mail className="w-8 h-8 mx-auto mb-3 text-health-mint-500" />
          <h3 className="font-semibold text-health-navy-800 dark:text-white mb-2">
            Email Support
          </h3>
          <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
            Send us an email
          </p>
        </button>
        
        <button className="p-6 glass-card rounded-2xl hover-lift transition-smooth text-center">
          <Phone className="w-8 h-8 mx-auto mb-3 text-health-lavender-500" />
          <h3 className="font-semibold text-health-navy-800 dark:text-white mb-2">
            Call Support
          </h3>
          <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
            +1 (555) 123-4567
          </p>
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
          Support Tickets
        </h2>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Track your support requests and get help
        </p>
      </div>

      {/* New Ticket Button */}
      <button className="w-full p-4 gradient-primary text-white rounded-2xl hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2">
        <MessageSquare className="w-5 h-5" />
        <span className="font-semibold">Create New Support Ticket</span>
      </button>

      {/* Support Tickets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
          Your Support Tickets
        </h3>
        
        {supportTickets.map((ticket) => (
          <div key={ticket.id} className="neuro rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-health-navy-800 dark:text-white">
                  {ticket.title}
                </h4>
                <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                  Ticket #{ticket.id} • {ticket.date}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                ticket.status === 'resolved'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : ticket.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {ticket.status === 'resolved' && <Check className="w-3 h-3 inline mr-1" />}
                {ticket.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                {ticket.status}
              </span>
            </div>
            
            {ticket.response && (
              <div className="mt-4 p-4 glass-card rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-health-teal-500" />
                  <span className="text-sm font-medium text-health-teal-600 dark:text-health-teal-400">
                    Support Response
                  </span>
                </div>
                <p className="text-sm text-health-navy-700 dark:text-health-navy-300">
                  {ticket.response}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Options */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
          Other Ways to Get Help
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4 p-4 neuro rounded-xl">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-health-navy-800 dark:text-white">
                Email Support
              </h4>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                support@healthtech.com
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 neuro rounded-xl">
            <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-health-navy-800 dark:text-white">
                Phone Support
              </h4>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 text-center">
        <div className="w-16 h-16 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
          Feedback & Support
        </h1>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          We're here to help and improve your experience
        </p>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-smooth ${
                activeTab === tab.id
                  ? 'gradient-primary text-white shadow-lg'
                  : 'glass-card text-health-navy-600 dark:text-health-navy-300 hover:bg-white/20 dark:hover:bg-black/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'feedback' && renderFeedback()}
        {activeTab === 'help' && renderHelp()}
        {activeTab === 'support' && renderSupport()}
      </div>
    </div>
  );
};

export default FeedbackHelp;
