import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { motion, easeInOut, easeOut, type Variants } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Thermometer, Droplets, Wind, Sun, CloudRain,
  Gauge, Cloud
} from 'lucide-react';
import type { RootState } from '../store';
import type { ChartData } from '../types/weather';

interface WeatherChartsProps {
  data: ChartData[];
  cityName: string;
}


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      ease: easeInOut,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const glowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

const WeatherCharts: React.FC<WeatherChartsProps> = ({ data, cityName }) => {
  const { isCelsius } = useSelector((state: RootState) => state.settings);

  // Premium data processing with enhanced metrics
  const chartData = useMemo(() => {
    const temperatureData = data.map((item) => ({
      time: new Date(item.time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      hour: new Date(item.time).getHours(),
      temperature: isCelsius ? item.temperature : (item.temperature * 9/5) + 32,
      feelsLike: isCelsius ? (item as any).feelsLike || item.temperature : ((item as any).feelsLike || item.temperature) * 9/5 + 32,
      comfortIndex: Math.max(0, 100 - Math.abs((item.temperature - 22) * 3)),
    }));

    const precipitationData = data.map(item => ({
      time: new Date(item.time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      precipitation: item.precipitation,
      humidity: item.humidity,
      cloudCover: (item as any).cloudCover || Math.min(100, item.humidity * 1.2),
      visibility: (item as any).visibility || 10 - item.precipitation,
    }));

    const windData = data.map(item => ({
      time: new Date(item.time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      }),
      windSpeed: item.windSpeed,
      gustSpeed: item.windSpeed * 1.4,
      windPower: Math.min(100, (item.windSpeed / 50) * 100),
    }));

    const uvData = [
      { name: 'Low', value: data.filter(d => d.uvIndex <= 2).length, level: 1, color: '#00E396' },
      { name: 'Moderate', value: data.filter(d => d.uvIndex > 2 && d.uvIndex <= 5).length, level: 2, color: '#FEB019' },
      { name: 'High', value: data.filter(d => d.uvIndex > 5 && d.uvIndex <= 7).length, level: 3, color: '#FF4560' },
      { name: 'Very High', value: data.filter(d => d.uvIndex > 7 && d.uvIndex <= 10).length, level: 4, color: '#775DD0' },
      { name: 'Extreme', value: data.filter(d => d.uvIndex > 10).length, level: 5, color: '#FF0000' },
    ].filter(item => item.value > 0);

    // Advanced metrics for radial charts
    const comfortAvg = temperatureData.reduce((acc, curr) => acc + curr.comfortIndex, 0) / temperatureData.length;
    const windPowerAvg = windData.reduce((acc, curr) => acc + curr.windPower, 0) / windData.length;

    const comfortData = [
      { name: 'Comfort', value: comfortAvg, fill: '#00E396' },
      { name: 'Remaining', value: Math.max(0, 100 - comfortAvg), fill: '#1E293B' }
    ];

    const windRadialData = [
      { name: 'Wind Power', value: windPowerAvg, fill: '#0088FE' },
      { name: 'Remaining', value: Math.max(0, 100 - windPowerAvg), fill: '#1E293B' }
    ];

    return {
      temperatureData,
      precipitationData,
      windData,
      uvData,
      comfortData,
      windRadialData,
      stats: {
        avgTemp: Math.round(temperatureData.reduce((acc, curr) => acc + curr.temperature, 0) / temperatureData.length),
        maxWind: Math.max(...windData.map(d => d.windSpeed)),
        rainChance: Math.round(Math.max(...precipitationData.map(d => Math.min(100, d.precipitation * 25)))),
        peakUV: Math.max(...data.map(d => d.uvIndex)),
        avgHumidity: Math.round(precipitationData.reduce((acc, curr) => acc + curr.humidity, 0) / precipitationData.length),
        comfortLevel: Math.round(comfortAvg),
      }
    };
  }, [data, isCelsius]);

  // Ultra-premium tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-6 min-w-[280px] relative overflow-hidden"
      >
        {/* Tooltip glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
            <p className="text-white font-bold text-lg">{label}</p>
          </div>

          <div className="space-y-3">
            {payload.map((entry: any, index: number) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${entry.color} 0%, ${entry.color}99 100%)`,
                      boxShadow: `0 0 20px ${entry.color}40`
                    }}
                  />
                  <span className="text-slate-300 font-semibold text-sm capitalize">
                    {entry.dataKey === 'feelsLike' ? 'Feels Like' :
                      entry.dataKey === 'gustSpeed' ? 'Gust Speed' :
                        entry.dataKey === 'comfortIndex' ? 'Comfort Level' :
                          entry.dataKey === 'cloudCover' ? 'Cloud Cover' :
                            entry.dataKey === 'windPower' ? 'Wind Power' :
                              entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {entry.value}
                  {entry.dataKey.includes('temperature') || entry.dataKey.includes('feelsLike') ? '°' :
                    entry.dataKey.includes('Speed') ? ' km/h' :
                      entry.dataKey.includes('humidity') || entry.dataKey.includes('cloud') || entry.dataKey.includes('comfort') || entry.dataKey.includes('Power') ? '%' :
                        entry.dataKey.includes('precipitation') ? 'mm' : ''}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Premium radial label
  const renderRadialLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.1) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={14}
        fontWeight="800"
        className="drop-shadow-2xl"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: [0, 0, 1, 1] }, // linear bezier
              scale: { duration: 2, repeat: Infinity }
            }}
            className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-cyan-500/30"
          >
            <Cloud className="h-12 w-12 text-cyan-400" />
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
            Analyzing Weather Patterns
          </h3>
          <p className="text-slate-400 text-lg">Preparing stunning visualizations for {cityName}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: easeInOut
          }}
          className="absolute top-1/4 left-1/4 text-cyan-500/10"
        >
          <Cloud className="w-32 h-32" />
        </motion.div>
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: easeInOut,
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 text-blue-500/10"
        >
          <CloudRain className="w-28 h-28" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={cardVariants}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Weather Analytics
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, ease: easeInOut }}
            className="text-xl text-slate-400 font-light"
          >
            Advanced meteorological insights for <span className="text-cyan-400 font-semibold">{cityName}</span>
          </motion.p>
        </motion.div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Temperature Masterpiece */}
          <motion.div
            variants={cardVariants}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
            <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl"
                  >
                    <Thermometer className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Temperature Analysis</h3>
                    <p className="text-slate-400">Real-time thermal dynamics</p>
                  </div>
                </div>
                <motion.div
                  variants={glowVariants}
                  className="text-right"
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {chartData.stats.avgTemp}°
                  </div>
                  <div className="text-slate-400 text-sm">Avg Temperature</div>
                </motion.div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.temperatureData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="feelsLikeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="url(#tempGradient)"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 8, fill: '#22D3EE', stroke: '#FFFFFF', strokeWidth: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="feelsLike"
                    stroke="url(#feelsLikeGradient)"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Atmospheric Conditions */}
          <motion.div
            variants={cardVariants}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-600/10 to-cyan-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
            <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl"
                  >
                    <CloudRain className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Atmospheric Data</h3>
                    <p className="text-slate-400">Moisture & visibility metrics</p>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.precipitationData}>
                  <defs>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="precipitation"
                    stroke="#8B5CF6"
                    fill="url(#rainGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="#10B981"
                    fill="url(#humidityGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Wind Power Analysis */}
          <motion.div
            variants={cardVariants}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-600/10 to-purple-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
            <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl"
                  >
                    <Wind className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Wind Dynamics</h3>
                    <p className="text-slate-400">Speed & power distribution</p>
                  </div>
                </div>
                <motion.div
                  variants={glowVariants}
                  className="text-right"
                >
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    {chartData.stats.maxWind}
                  </div>
                  <div className="text-slate-400 text-sm">Max Speed km/h</div>
                </motion.div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.windData}>
                  <defs>
                    <linearGradient id="windBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="gustBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="windSpeed"
                    fill="url(#windBarGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="gustSpeed"
                    fill="url(#gustBarGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* UV & Comfort Radial */}
          <motion.div
            variants={cardVariants}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-600/10 to-rose-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
            <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl"
                  >
                    <Sun className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">UV & Comfort Index</h3>
                    <p className="text-slate-400">Safety & comfort metrics</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 h-64">
                {/* UV Radial */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="30%"
                      outerRadius="90%"
                      data={chartData.uvData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        label={{ fill: '#fff', position: 'insideStart' }}
                        background
                        dataKey="value"
                        cornerRadius={10}
                      >
                        {chartData.uvData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RadialBar>
                      <Legend />
                      <Tooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-black text-white">{chartData.stats.peakUV}</div>
                    <div className="text-slate-400 text-sm">Peak UV</div>
                  </div>
                </div>

                {/* Comfort Radial */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.comfortData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={renderRadialLabel}
                      >
                        {chartData.comfortData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-black text-white">{chartData.stats.comfortLevel}%</div>
                    <div className="text-slate-400 text-sm">Comfort</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <motion.div
          variants={cardVariants}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-600/10 to-rose-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
          <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Thermometer, label: 'Temperature', value: `${chartData.stats.avgTemp}°`, color: 'from-cyan-400 to-blue-500' },
                { icon: Wind, label: 'Wind Speed', value: `${chartData.stats.maxWind} km/h`, color: 'from-blue-400 to-indigo-500' },
                { icon: Droplets, label: 'Humidity', value: `${chartData.stats.avgHumidity}%`, color: 'from-emerald-400 to-teal-500' },
                { icon: Gauge, label: 'Rain Chance', value: `${chartData.stats.rainChance}%`, color: 'from-purple-400 to-pink-500' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-slate-700/30 rounded-3xl p-6 text-center backdrop-blur-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 group/card"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/card:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-400 font-semibold text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCharts;




// // src/components/Charts/WeatherCharts.tsx
// import React, { useMemo } from 'react';
// import { motion } from 'framer-motion';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, AreaChart, Area, BarChart, Bar,
//   PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar
// } from 'recharts';
// import { useSelector } from 'react-redux';
// import { 
//   Thermometer, Droplets, Wind, Sun, CloudRain, 
//   Gauge, Cloud
// } from 'lucide-react';
// import type { RootState } from '../store';
// import type { ChartData } from '../types/weather';

// interface WeatherChartsProps {
//   data: ChartData[];
//   cityName: string;
// }

// // Premium animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2
//     }
//   }
// };

// const cardVariants = {
//   hidden: { 
//     opacity: 0, 
//     y: 60,
//     scale: 0.9,
//     rotateX: -15
//   },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     scale: 1,
//     rotateX: 0,
//     transition: {
//       type: "spring",
//       damping: 15,
//       stiffness: 100,
//       duration: 0.8
//     }
//   }
// };

// const glowVariants = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: { 
//     opacity: 1, 
//     scale: 1,
//     transition: {
//       duration: 1.5,
//       repeat: Infinity,
//       repeatType: "reverse" as const
//     }
//   }
// };



// const WeatherCharts: React.FC<WeatherChartsProps> = ({ data, cityName }) => {
//   const { isCelsius } = useSelector((state: RootState) => state.settings);

//   // Premium data processing with enhanced metrics
//   const chartData = useMemo(() => {
//     const temperatureData = data.map((item) => ({
//       time: new Date(item.time).toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         hour12: true 
//       }),
//       hour: new Date(item.time).getHours(),
//       temperature: isCelsius ? item.temperature : (item.temperature * 9/5) + 32,
//       feelsLike: isCelsius ? (item as any).feelsLike || item.temperature : ((item as any).feelsLike || item.temperature) * 9/5 + 32,
//       comfortIndex: Math.max(0, 100 - Math.abs((item.temperature - 22) * 3)),
//     }));

//     const precipitationData = data.map(item => ({
//       time: new Date(item.time).toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         hour12: true 
//       }),
//       precipitation: item.precipitation,
//       humidity: item.humidity,
//       cloudCover: (item as any).cloudCover || Math.min(100, item.humidity * 1.2),
//       visibility: (item as any).visibility || 10 - item.precipitation,
//     }));

//     const windData = data.map(item => ({
//       time: new Date(item.time).toLocaleTimeString('en-US', { 
//         hour: 'numeric', 
//         hour12: true 
//       }),
//       windSpeed: item.windSpeed,
//       gustSpeed: item.windSpeed * 1.4,
//       windPower: Math.min(100, (item.windSpeed / 50) * 100),
//     }));

//     const uvData = [
//       { name: 'Low', value: data.filter(d => d.uvIndex <= 2).length, level: 1, color: '#00E396' },
//       { name: 'Moderate', value: data.filter(d => d.uvIndex > 2 && d.uvIndex <= 5).length, level: 2, color: '#FEB019' },
//       { name: 'High', value: data.filter(d => d.uvIndex > 5 && d.uvIndex <= 7).length, level: 3, color: '#FF4560' },
//       { name: 'Very High', value: data.filter(d => d.uvIndex > 7 && d.uvIndex <= 10).length, level: 4, color: '#775DD0' },
//       { name: 'Extreme', value: data.filter(d => d.uvIndex > 10).length, level: 5, color: '#FF0000' },
//     ].filter(item => item.value > 0);

//     // Advanced metrics for radial charts
//     const comfortData = [
//       { name: 'Comfort', value: temperatureData.reduce((acc, curr) => acc + curr.comfortIndex, 0) / temperatureData.length, fill: '#00E396' },
//       { name: 'Remaining', value: 100 - (temperatureData.reduce((acc, curr) => acc + curr.comfortIndex, 0) / temperatureData.length), fill: '#1E293B' }
//     ];

//     const windRadialData = [
//       { name: 'Wind Power', value: windData.reduce((acc, curr) => acc + curr.windPower, 0) / windData.length, fill: '#0088FE' },
//       { name: 'Remaining', value: 100 - (windData.reduce((acc, curr) => acc + curr.windPower, 0) / windData.length), fill: '#1E293B' }
//     ];

//     return {
//       temperatureData,
//       precipitationData,
//       windData,
//       uvData,
//       comfortData,
//       windRadialData,
//       stats: {
//         avgTemp: Math.round(temperatureData.reduce((acc, curr) => acc + curr.temperature, 0) / temperatureData.length),
//         maxWind: Math.max(...windData.map(d => d.windSpeed)),
//         rainChance: Math.round(Math.max(...precipitationData.map(d => Math.min(100, d.precipitation * 25)))),
//         peakUV: Math.max(...data.map(d => d.uvIndex)),
//         avgHumidity: Math.round(precipitationData.reduce((acc, curr) => acc + curr.humidity, 0) / precipitationData.length),
//         comfortLevel: Math.round(temperatureData.reduce((acc, curr) => acc + curr.comfortIndex, 0) / temperatureData.length),
//       }
//     };
//   }, [data, isCelsius]);

//   // Ultra-premium tooltip
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (!active || !payload) return null;

//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl p-6 min-w-[280px] relative overflow-hidden"
//       >
//         {/* Tooltip glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl" />
        
//         <div className="relative z-10">
//           <div className="flex items-center space-x-2 mb-4">
//             <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
//             <p className="text-white font-bold text-lg">{label}</p>
//           </div>
          
//           <div className="space-y-3">
//             {payload.map((entry: any, index: number) => (
//               <motion.div
//                 key={index}
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div 
//                     className="w-3 h-3 rounded-full shadow-lg"
//                     style={{ 
//                       background: `linear-gradient(135deg, ${entry.color} 0%, ${entry.color}99 100%)`,
//                       boxShadow: `0 0 20px ${entry.color}40`
//                     }}
//                   />
//                   <span className="text-slate-300 font-semibold text-sm capitalize">
//                     {entry.dataKey === 'feelsLike' ? 'Feels Like' : 
//                      entry.dataKey === 'gustSpeed' ? 'Gust Speed' :
//                      entry.dataKey === 'comfortIndex' ? 'Comfort Level' :
//                      entry.dataKey === 'cloudCover' ? 'Cloud Cover' :
//                      entry.dataKey === 'windPower' ? 'Wind Power' :
//                      entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}
//                   </span>
//                 </div>
//                 <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//                   {entry.value}
//                   {entry.dataKey.includes('temperature') || entry.dataKey.includes('feelsLike') ? '°' : 
//                    entry.dataKey.includes('Speed') ? ' km/h' : 
//                    entry.dataKey.includes('humidity') || entry.dataKey.includes('cloud') || entry.dataKey.includes('comfort') || entry.dataKey.includes('Power') ? '%' : 
//                    entry.dataKey.includes('precipitation') ? 'mm' : ''}
//                 </span>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Premium radial label
//   const renderRadialLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
//     if (percent < 0.1) return null;
    
//     const RADIAN = Math.PI / 180;
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text 
//         x={x} 
//         y={y} 
//         fill="white" 
//         textAnchor={x > cx ? 'start' : 'end'} 
//         dominantBaseline="central"
//         fontSize={14}
//         fontWeight="800"
//         className="drop-shadow-2xl"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   if (!data || data.length === 0) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex items-center justify-center min-h-[60vh]"
//       >
//         <div className="text-center">
//           <motion.div
//             animate={{ 
//               rotate: 360,
//               scale: [1, 1.1, 1]
//             }}
//             transition={{ 
//               rotate: { duration: 3, repeat: Infinity, ease: "linear" },
//               scale: { duration: 2, repeat: Infinity }
//             }}
//             className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-cyan-500/30"
//           >
//             <Cloud className="h-12 w-12 text-cyan-400" />
//           </motion.div>
//           <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
//             Analyzing Weather Patterns
//           </h3>
//           <p className="text-slate-400 text-lg">Preparing stunning visualizations for {cityName}</p>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
//     >
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{ 
//             x: [0, 100, 0],
//             y: [0, -50, 0],
//             rotate: [0, 5, 0]
//           }}
//           transition={{ 
//             duration: 20,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//           className="absolute top-1/4 left-1/4 text-cyan-500/10"
//         >
//           <Cloud className="w-32 h-32" />
//         </motion.div>
//         <motion.div
//           animate={{ 
//             x: [0, -80, 0],
//             y: [0, 60, 0],
//             rotate: [0, -3, 0]
//           }}
//           transition={{ 
//             duration: 25,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 2
//           }}
//           className="absolute bottom-1/4 right-1/4 text-blue-500/10"
//         >
//           <CloudRain className="w-28 h-28" />
//         </motion.div>
//       </div>

//       <div className="max-w-7xl mx-auto space-y-8 relative z-10">
//         {/* Header */}
//         <motion.div
//           variants={cardVariants}
//           className="text-center mb-12"
//         >
//           <motion.h1 
//             initial={{ y: -50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
//           >
//             Weather Analytics
//           </motion.h1>
//           <motion.p 
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-slate-400 font-light"
//           >
//             Advanced meteorological insights for <span className="text-cyan-400 font-semibold">{cityName}</span>
//           </motion.p>
//         </motion.div>

//         {/* Main Charts Grid */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           {/* Temperature Masterpiece */}
//           <motion.div
//             variants={cardVariants}
//             className="relative group"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
//             <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
//               {/* Header */}
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center space-x-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 5 }}
//                     className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl"
//                   >
//                     <Thermometer className="h-8 w-8 text-white" />
//                   </motion.div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-white">Temperature Analysis</h3>
//                     <p className="text-slate-400">Real-time thermal dynamics</p>
//                   </div>
//                 </div>
//                 <motion.div
//                   variants={glowVariants}
//                   className="text-right"
//                 >
//                   <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//                     {chartData.stats.avgTemp}°
//                   </div>
//                   <div className="text-slate-400 text-sm">Avg Temperature</div>
//                 </motion.div>
//               </div>

//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={chartData.temperatureData}>
//                   <defs>
//                     <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.8}/>
//                       <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.1}/>
//                     </linearGradient>
//                     <linearGradient id="feelsLikeGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6}/>
//                       <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
//                   <XAxis 
//                     dataKey="time" 
//                     stroke="#94A3B8"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <YAxis 
//                     stroke="#94A3B8"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Line 
//                     type="monotone" 
//                     dataKey="temperature" 
//                     stroke="url(#tempGradient)"
//                     strokeWidth={4}
//                     dot={false}
//                     activeDot={{ r: 8, fill: '#22D3EE', stroke: '#FFFFFF', strokeWidth: 3 }}
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="feelsLike" 
//                     stroke="url(#feelsLikeGradient)"
//                     strokeWidth={3}
//                     strokeDasharray="5 5"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//           {/* Atmospheric Conditions */}
//           <motion.div
//             variants={cardVariants}
//             className="relative group"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-600/10 to-cyan-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
//             <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center space-x-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: -5 }}
//                     className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl"
//                   >
//                     <CloudRain className="h-8 w-8 text-white" />
//                   </motion.div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-white">Atmospheric Data</h3>
//                     <p className="text-slate-400">Moisture & visibility metrics</p>
//                   </div>
//                 </div>
//               </div>

//               <ResponsiveContainer width="100%" height={300}>
//                 <AreaChart data={chartData.precipitationData}>
//                   <defs>
//                     <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
//                       <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2}/>
//                     </linearGradient>
//                     <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
//                       <stop offset="100%" stopColor="#10B981" stopOpacity={0.2}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
//                   <XAxis 
//                     dataKey="time" 
//                     stroke="#94A3B8"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <YAxis 
//                     stroke="#94A3B8"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area 
//                     type="monotone" 
//                     dataKey="precipitation" 
//                     stroke="#8B5CF6"
//                     fill="url(#rainGradient)"
//                     strokeWidth={2}
//                   />
//                   <Area 
//                     type="monotone" 
//                     dataKey="humidity" 
//                     stroke="#10B981"
//                     fill="url(#humidityGradient)"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//           {/* Wind Power Analysis */}
//           <motion.div
//             variants={cardVariants}
//             className="relative group"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-600/10 to-purple-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
//             <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center space-x-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 5 }}
//                     className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl"
//                   >
//                     <Wind className="h-8 w-8 text-white" />
//                   </motion.div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-white">Wind Dynamics</h3>
//                     <p className="text-slate-400">Speed & power distribution</p>
//                   </div>
//                 </div>
//                 <motion.div
//                   variants={glowVariants}
//                   className="text-right"
//                 >
//                   <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
//                     {chartData.stats.maxWind}
//                   </div>
//                   <div className="text-slate-400 text-sm">Max Speed km/h</div>
//                 </motion.div>
//               </div>

//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData.windData}>
//                   <defs>
//                     <linearGradient id="windBarGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
//                       <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4}/>
//                     </linearGradient>
//                     <linearGradient id="gustBarGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
//                       <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
//                   <XAxis 
//                     dataKey="time" 
//                     stroke="#94A3B8"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <YAxis 
//                     stroke="#94A3B8"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar 
//                     dataKey="windSpeed" 
//                     fill="url(#windBarGradient)"
//                     radius={[8, 8, 0, 0]}
//                   />
//                   <Bar 
//                     dataKey="gustSpeed" 
//                     fill="url(#gustBarGradient)"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//           {/* UV & Comfort Radial */}
//           <motion.div
//             variants={cardVariants}
//             className="relative group"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-600/10 to-rose-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
//             <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center space-x-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: -5 }}
//                     className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl"
//                   >
//                     <Sun className="h-8 w-8 text-white" />
//                   </motion.div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-white">UV & Comfort Index</h3>
//                     <p className="text-slate-400">Safety & comfort metrics</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-8 h-64">
//                 {/* UV Radial */}
//                 <div className="relative">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RadialBarChart 
//                       innerRadius="30%" 
//                       outerRadius="90%" 
//                       data={chartData.uvData}
//                       startAngle={180}
//                       endAngle={0}
//                     >
//                       <RadialBar
//                         label={{ fill: '#fff', position: 'insideStart' }}
//                         background
//                         dataKey="value"
//                         cornerRadius={10}
//                       >
//                         {chartData.uvData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </RadialBar>
//                       <Legend />
//                       <Tooltip />
//                     </RadialBarChart>
//                   </ResponsiveContainer>
//                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//                     <div className="text-2xl font-black text-white">{chartData.stats.peakUV}</div>
//                     <div className="text-slate-400 text-sm">Peak UV</div>
//                   </div>
//                 </div>

//                 {/* Comfort Radial */}
//                 <div className="relative">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={chartData.comfortData}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         paddingAngle={5}
//                         dataKey="value"
//                         label={renderRadialLabel}
//                       >
//                         {chartData.comfortData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.fill} />
//                         ))}
//                       </Pie>
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//                     <div className="text-2xl font-black text-white">{chartData.stats.comfortLevel}%</div>
//                     <div className="text-slate-400 text-sm">Comfort</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Stats Overview */}
//         <motion.div
//           variants={cardVariants}
//           className="relative group"
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-600/10 to-rose-600/10 rounded-4xl blur-xl group-hover:blur-2xl transition-all duration-1000" />
//           <div className="relative bg-slate-800/40 backdrop-blur-2xl rounded-4xl border border-slate-700/50 p-8 shadow-2xl">
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//               {[
//                 { icon: Thermometer, label: 'Temperature', value: `${chartData.stats.avgTemp}°`, color: 'from-cyan-400 to-blue-500' },
//                 { icon: Wind, label: 'Wind Speed', value: `${chartData.stats.maxWind} km/h`, color: 'from-blue-400 to-indigo-500' },
//                 { icon: Droplets, label: 'Humidity', value: `${chartData.stats.avgHumidity}%`, color: 'from-emerald-400 to-teal-500' },
//                 { icon: Gauge, label: 'Rain Chance', value: `${chartData.stats.rainChance}%`, color: 'from-purple-400 to-pink-500' },
//               ].map((stat) => (
//                 <motion.div
//                   key={stat.label}
//                   whileHover={{ scale: 1.05, y: -5 }}
//                   className="bg-slate-700/30 rounded-3xl p-6 text-center backdrop-blur-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 group/card"
//                 >
//                   <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/card:scale-110 transition-transform duration-300 shadow-lg`}>
//                     <stat.icon className="h-8 w-8 text-white" />
//                   </div>
//                   <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
//                     {stat.value}
//                   </div>
//                   <div className="text-slate-400 font-semibold text-sm">
//                     {stat.label}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default WeatherCharts;