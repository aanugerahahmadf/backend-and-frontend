"use client"

import { useState, useEffect } from "react"
import { Activity, Zap, BarChart3, CheckCircle } from "lucide-react"
import { api } from '@/lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Home() {
  const [stats, setStats] = useState({
    total_buildings: 0,
    total_rooms: 0,
    total_cctvs: 0
  });
  const [productionTrends, setProductionTrends] = useState<any[]>([]);
  const [unitPerformance, setUnitPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>('checking');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
        setApiStatus('connected');
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setApiStatus('error');
      } finally {
        setLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        
        // Fetch real chart data from the backend
        const [productionData, unitData] = await Promise.all([
          api.getProductionTrends(),
          api.getUnitPerformance()
        ]);
        
        setProductionTrends(productionData);
        setUnitPerformance(unitData);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        // Fallback to mock data if API fails
        const mockProductionTrends = [
          { date: 'Jan', production: 4000, target: 4200 },
          { date: 'Feb', production: 3000, target: 3800 },
          { date: 'Mar', production: 2000, target: 2500 },
          { date: 'Apr', production: 2780, target: 3000 },
          { date: 'May', production: 1890, target: 2200 },
          { date: 'Jun', production: 2390, target: 2800 },
          { date: 'Jul', production: 3490, target: 3500 },
        ];
        
        const mockUnitPerformance = [
          { unit: 'Unit A', efficiency: 95, capacity: 85 },
          { unit: 'Unit B', efficiency: 87, capacity: 78 },
          { unit: 'Unit C', efficiency: 92, capacity: 88 },
          { unit: 'Unit D', efficiency: 78, capacity: 72 },
          { unit: 'Unit E', efficiency: 88, capacity: 82 },
        ];
        
        setProductionTrends(mockProductionTrends);
        setUnitPerformance(mockUnitPerformance);
      } finally {
        setChartLoading(false);
      }
    };

    fetchStats();
    fetchChartData();
  }, []);

  return (
    <main className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 py-12 min-h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="w-full pt-4 pb-8 px-4">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Production Rate - Total Buildings */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 font-semibold text-sm mb-2">Total Buildings</p>
                <p className="text-3xl font-semibold text-white">
                  {loading ? '-' : stats.total_buildings}
                </p>
              </div>
              <Zap className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          {/* Efficiency - Total Rooms */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 font-semibold text-sm mb-2">Total Rooms</p>
                <p className="text-3xl font-semibold text-white">
                  {loading ? '-' : stats.total_rooms}
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          {/* Units Active - Total CCTVs */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 font-semibold text-sm mb-2">Total CCTVs</p>
                <p className="text-3xl font-semibold text-white">
                  {loading ? '-' : stats.total_cctvs}
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-400" />
            </div>
          </div>

          {/* System Status - Always Active */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 font-semibold text-sm mb-2">System Status</p>
                <p className="text-3xl font-semibold text-white">
                  {loading ? '-' : 'Active'}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production Trends Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Production Trends</h3>
            <div className="h-64">
              {chartLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white/50 font-semibold">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={productionTrends}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#ffffff20', 
                        borderRadius: '0.5rem',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="production"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      name="Actual Production"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Target Production"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Unit Performance Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Unit Performance</h3>
            <div className="h-64">
              {chartLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white/50 font-semibold">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={unitPerformance}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="unit" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#ffffff20', 
                        borderRadius: '0.5rem',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Bar
                      dataKey="efficiency"
                      fill="#3b82f6"
                      name="Efficiency %"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="capacity"
                      fill="#10b981"
                      name="Capacity %"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}