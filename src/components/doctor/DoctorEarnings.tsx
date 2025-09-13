
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const DoctorEarnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('this_month');

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user, period]);

  const fetchEarnings = async () => {
    try {
      // Get doctor ID first
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!doctorData) return;

      // Fetch earnings with appointment details
      const { data: earningsData, error } = await supabase
        .from('doctor_earnings')
        .select(`
          *,
          appointments (
            appointment_date,
            appointment_time,
            consultation_type,
            profiles!appointments_patient_id_fkey (
              name
            )
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEarnings(earningsData || []);
      calculateStats(earningsData || []);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (earningsData: any[]) => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const totalEarnings = earningsData.reduce((sum, earning) => sum + earning.doctor_earning, 0);
    
    const thisMonthEarnings = earningsData
      .filter(earning => {
        const date = new Date(earning.created_at);
        return date >= thisMonthStart && date <= thisMonthEnd;
      })
      .reduce((sum, earning) => sum + earning.doctor_earning, 0);

    const lastMonthEarnings = earningsData
      .filter(earning => {
        const date = new Date(earning.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((sum, earning) => sum + earning.doctor_earning, 0);

    const pendingEarnings = earningsData
      .filter(earning => !earning.paid_at)
      .reduce((sum, earning) => sum + earning.doctor_earning, 0);

    setStats({
      totalEarnings,
      thisMonth: thisMonthEarnings,
      lastMonth: lastMonthEarnings,
      pending: pendingEarnings
    });
  };

  const getFilteredEarnings = () => {
    const now = new Date();
    
    switch (period) {
      case 'this_month':
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        return earnings.filter(earning => {
          const date = new Date(earning.created_at);
          return date >= thisMonthStart && date <= thisMonthEnd;
        });
      
      case 'last_month':
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));
        return earnings.filter(earning => {
          const date = new Date(earning.created_at);
          return date >= lastMonthStart && date <= lastMonthEnd;
        });
      
      case 'pending':
        return earnings.filter(earning => !earning.paid_at);
      
      default:
        return earnings;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
          <p className="text-health-navy-600 dark:text-health-navy-300">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
          Earnings & Reports
        </h1>
        
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="pending">Pending Payments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              ₹{stats.thisMonth.toLocaleString()}
            </div>
            {stats.lastMonth > 0 && (
              <p className="text-xs text-health-navy-500 dark:text-health-navy-400">
                {stats.thisMonth > stats.lastMonth ? '+' : ''}
                {((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              ₹{stats.lastMonth.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              ₹{stats.pending.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          {getFilteredEarnings().length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-health-navy-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-health-navy-600 dark:text-health-navy-300 mb-2">
                No earnings found
              </h3>
              <p className="text-health-navy-500 dark:text-health-navy-400">
                {period === 'pending' 
                  ? 'All payments have been processed.'
                  : 'No earnings for the selected period.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredEarnings().map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-4 border border-health-navy-200 dark:border-health-navy-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-health-navy-800 dark:text-white">
                        Consultation with {earning.appointments?.profiles?.name || 'Unknown Patient'}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        earning.paid_at 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {earning.paid_at ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-health-navy-600 dark:text-health-navy-300">
                      <span>
                        {format(new Date(earning.appointments?.appointment_date || earning.created_at), 'PPP')}
                      </span>
                      <span className="capitalize">
                        {earning.appointments?.consultation_type}
                      </span>
                      <span>
                        Commission: {earning.commission_percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-health-navy-800 dark:text-white">
                      ₹{earning.doctor_earning.toLocaleString()}
                    </div>
                    <div className="text-sm text-health-navy-500 dark:text-health-navy-400">
                      Total: ₹{earning.amount.toLocaleString()}
                    </div>
                    {earning.paid_at && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Paid: {format(new Date(earning.paid_at), 'PPp')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorEarnings;
