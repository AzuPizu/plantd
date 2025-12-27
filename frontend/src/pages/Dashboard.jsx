import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bg from '../assets/bg.jpg';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState({ fullName: '', deathCount: 0, createdAt: '' });
  const [plants, setPlants] = useState([]);
  const [greeting, setGreeting] = useState('');
  const [timeRange, setTimeRange] = useState(7);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const handlePlantClick = (plant) => {
    navigate('/collection', { state: { openPlantId: plant._id } });
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const userRes = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
        const uData = await userRes.json();
        setUserData(uData);

        const plantRes = await fetch(`http://localhost:5000/api/plants/user/${userId}`);
        const pData = await plantRes.json();
        setPlants(pData);
        processLogic(pData, timeRange);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [timeRange]);

  const processLogic = (allPlants, days) => {
    const dataPoints = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dataPoints.push({
        displayDate: d.toLocaleDateString('en-US', days > 7 ? { month: 'short', day: 'numeric' } : { weekday: 'short' }),
        fullDate: d.toDateString(),
        watered: 0,
        required: 0
      });
    }

    allPlants.forEach(plant => {
      const start = new Date(plant.lastWateredDate);
      start.setHours(0, 0, 0, 0);
      const cycle = parseInt(plant.baseWateringDays);
      dataPoints.forEach(point => {
        const currentPointDate = new Date(point.fullDate);
        const diff = Math.floor((currentPointDate - start) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff % cycle === 0) point.required += 1;
        const wasWatered = plant.careHistory?.some(log =>
          new Date(log.date).toDateString() === point.fullDate && log.actionType === 'Watered'
        );
        if (wasWatered) point.watered += 1;
      });
    });
    setChartData(dataPoints);
  };

  const thirstyPlants = useMemo(() => {
    return [...plants]
      .map(p => {
        const next = new Date(p.lastWateredDate);
        next.setDate(next.getDate() + p.baseWateringDays);
        const diff = Math.ceil((next - new Date()) / (1000 * 60 * 60 * 24));
        return { ...p, daysLeft: diff };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }, [plants]);

  const gardenAge = useMemo(() => {
    const creationDate = userData.createdAt || (plants.length > 0 ? [...plants].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))[0].createdAt : null);
    if (!creationDate) return 0;
    const diff = new Date() - new Date(creationDate);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  }, [userData, plants]);

  const totals = useMemo(() => {
    const w = chartData.reduce((acc, curr) => acc + curr.watered, 0);
    const r = chartData.reduce((acc, curr) => acc + curr.required, 0);
    const percent = r > 0 ? Math.round((w / r) * 100) : 100;
    
    let color = 'text-green-400';
    let label = 'Accuracy';
    let isWarning = false;

    if (percent > 100) {
      color = 'text-red-500 animate-pulse';
      label = 'OVERWATERING';
      isWarning = true;
    } else if (percent > 75) {
      color = 'text-green-400';
    } else if (percent > 40) {
      color = 'text-orange-400';
    } else {
      color = 'text-red-500';
    }

    return { percent, color, label, isWarning };
  }, [chartData]);

  const aliveCount = plants.length;
  const totalEver = aliveCount + userData.deathCount;
  const survivalRate = totalEver > 0 ? Math.round((aliveCount / totalEver) * 100) : 100;

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ backgroundImage: `url(${bg})`, backgroundColor: 'rgba(10, 26, 10, 0.7)', backgroundBlendMode: 'multiply' }}>
      <Navbar />
      <main className="flex-grow pt-32 px-8 pb-20">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-5xl font-bold text-white tracking-tighter">{greeting}, {userData.fullName}</h1>
              <p className="text-2xl font-light text-green-100/80 mt-2">Here's how your garden looks today.</p>
            </div>
            <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              {[{ l: '7D', v: 7 }, { l: '1M', v: 30 }, { l: '6M', v: 180 }, { l: '1Y', v: 365 }].map(opt => (
                <button key={opt.v} onClick={() => setTimeRange(opt.v)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${timeRange === opt.v ? 'bg-green-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Plants Alive" val={aliveCount} color="text-white" />
            <StatCard label="Plant Deaths" val={userData.deathCount} color="text-orange-500" />
            <StatCard label="Survival Rate" val={`${survivalRate}%`} color="text-green-400" />
            <StatCard label="Garden Age" val={`${gardenAge}d`} color="text-blue-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 bg-white/5 backdrop-blur-xl border ${totals.isWarning ? 'border-red-500/50 shadow-red-500/10' : 'border-white/10'} rounded-[3rem] p-10 shadow-2xl relative transition-all duration-500`}>
              <div className="flex justify-between items-start mb-8 ml-2">
                <h3 className="text-xl font-bold text-white opacity-80 uppercase tracking-widest">Consistency Trends</h3>
                <div className="text-right">
                  <p className={`text-3xl font-black ${totals.color}`}>{totals.percent}%</p>
                  <p className={`text-[10px] uppercase font-bold tracking-widest ${totals.isWarning ? 'text-red-400' : 'text-white/30'}`}>
                    {totals.label}
                  </p>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="colorWatered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={totals.isWarning ? "#ef4444" : "#22c55e"} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={totals.isWarning ? "#ef4444" : "#22c55e"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: '#ffffff30', fontSize: 10 }} dy={10} minTickGap={timeRange > 7 ? 30 : 0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff10', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0a1a0a', border: `1px solid ${totals.isWarning ? '#ef444430' : '#ffffff10'}`, borderRadius: '16px', backdropFilter: 'blur(10px)' }} itemStyle={{ color: totals.isWarning ? '#ef4444' : '#22c55e' }} />
                    <Area type="monotone" dataKey="required" stroke="#ffffff20" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="Goal" activeDot={false} />
                    <Area type="monotone" dataKey="watered" stroke={totals.isWarning ? "#ef4444" : "#22c55e"} strokeWidth={4} fill="url(#colorWatered)" name="Action" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 opacity-80 uppercase tracking-widest">High Urgency</h3>
              <div className="space-y-4">
                {thirstyPlants.map((plant, i) => (
                  <div key={i} onClick={() => handlePlantClick(plant)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                    <div className={`w-2 h-10 rounded-full ${plant.daysLeft <= 0 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-orange-500'}`}></div>
                    <div className="flex-grow">
                      <p className="text-white font-bold text-sm leading-tight">{plant.name}</p>
                      <p className={`text-xs mt-1 ${plant.daysLeft <= 0 ? 'text-red-400 font-black' : 'text-gray-400'}`}>{plant.daysLeft <= 0 ? 'NEEDS WATER NOW' : `Due in ${plant.daysLeft} days`}</p>
                    </div>
                  </div>
                ))}
                {plants.length === 0 && <p className="text-white/20 italic text-center py-10">No plants tracked.</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ label, val, color }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-xl hover:bg-white/10 transition">
    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-5xl font-bold ${color}`}>{val}</p>
  </div>
);

export default Dashboard;