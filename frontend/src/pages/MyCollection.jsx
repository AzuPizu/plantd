import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlantCard from '../components/PlantCard';
import bg from '../assets/bg.jpg';
import { useLocation, useNavigate } from 'react-router-dom'; // Fixed: Added useNavigate import

const MyCollection = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialized navigate
  const [plants, setPlants] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State for Adding New Plant
  const [formData, setFormData] = useState({
    name: '', species: '', baseWateringDays: '', lastWateredDate: '', location: 'Indoor', image: null
  });

  // --- 1. Fetch Logic (Memoized with useCallback) ---
  const fetchUserPlants = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/plants/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setPlants(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial Data Load
  useEffect(() => {
    fetchUserPlants();
  }, [fetchUserPlants]);

  // 3. Handle Dashboard Redirection & Modal Auto-Open
  useEffect(() => {
    const openId = location.state?.openPlantId;
    
    if (openId && plants.length > 0) {
      const targetPlant = plants.find(p => p._id === openId);
      if (targetPlant) {
        setEditingPlant(targetPlant);
        // CRITICAL FIX: Clear the navigation state immediately after using it 
        // to prevent the modal from re-opening on next render.
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, location.pathname, navigate, plants]);

  // --- 4. Sorting Logic ---
  const getSortedPlants = () => {
    return [...plants].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'dateAdded') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'lastWatered') return new Date(b.lastWateredDate) - new Date(a.lastWateredDate);
      if (sortBy === 'wateringUrgency') {
        const getDays = (p) => {
          const next = new Date(p.lastWateredDate);
          next.setDate(next.getDate() + p.baseWateringDays);
          return next - new Date();
        };
        return getDays(a) - getDays(b);
      }
      return 0;
    });
  };

  const sortedPlants = getSortedPlants();

  // --- 5. Event Handlers ---
  const handleAddPlant = async (e) => {
    e.preventDefault();
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) return;

    const data = new FormData();
    data.append('userId', storedUserId);
    data.append('name', formData.name);
    data.append('species', formData.species);
    data.append('baseWateringDays', formData.baseWateringDays);
    data.append('lastWateredDate', formData.lastWateredDate);
    data.append('location', formData.location);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch('http://localhost:5000/api/plants', { method: 'POST', body: data });
      if (response.ok) {
        const result = await response.json();
        setIsModalOpen(false);
        setPlants((prev) => [result, ...prev]);
        setFormData({ name: '', species: '', baseWateringDays: '', lastWateredDate: '', location: 'Indoor', image: null });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdatePlant = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', editingPlant.name);
    data.append('species', editingPlant.species);
    data.append('baseWateringDays', editingPlant.baseWateringDays);
    if (editingPlant.newImage) data.append('image', editingPlant.newImage);

    try {
      const response = await fetch(`http://localhost:5000/api/plants/${editingPlant._id}`, { method: 'PATCH', body: data });
      if (response.ok) {
        setEditingPlant(null);
        fetchUserPlants();
      }
    } catch (err) { console.error("Update error:", err); }
  };

  const handleDeletePlant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plant forever?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEditingPlant(null);
        fetchUserPlants();
      }
    } catch (err) { console.error("Delete error:", err); }
  };

  const handleReportDeath = async (id) => {
    if (!window.confirm("Did this plant really die? This will increase your death count.")) return;
    const userId = localStorage.getItem('userId');
    try {
      await fetch(`http://localhost:5000/api/auth/increment-death/${userId}`, { method: 'PATCH' });
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEditingPlant(null);
        fetchUserPlants();
        alert("Plant death recorded.");
      }
    } catch (err) { console.error("Death reporting error:", err); }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col" style={{ backgroundImage: `url(${bg})`, backgroundColor: 'rgba(10, 26, 10, 0.7)', backgroundBlendMode: 'multiply' }}>
      <Navbar />

      <main className={`flex-grow pt-32 px-8 pb-20 transition-all duration-500 ${(isModalOpen || editingPlant) ? 'blur-xl brightness-50' : ''}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">My Collection</h1>
            <p className="text-gray-300 mt-2 font-medium text-lg">
              {loading ? 'Loading garden...' : `You have ${plants.length} ${plants.length === 1 ? 'plant' : 'plants'} in your garden.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <span className="text-white/40 text-xs font-bold uppercase ml-3 tracking-widest">Sort By:</span>
            <div className="flex gap-2">
              {[{ id: 'name', label: 'Name' }, { id: 'dateAdded', label: 'Newest' }, { id: 'wateringUrgency', label: 'Urgency' }, { id: 'lastWatered', label: 'Last Watered' }].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-tighter ${sortBy === option.id ? 'bg-green-500 text-white shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-400 text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all active:scale-95 whitespace-nowrap">+ ADD NEW PLANT</button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedPlants.map((plant) => (
            <PlantCard
              key={plant._id}
              id={plant._id}
              name={plant.name}
              lastWateredDate={plant.lastWateredDate}
              baseWateringDays={plant.baseWateringDays}
              imageUrl={plant.imageUrl}
              onWaterSuccess={fetchUserPlants}
              onManageClick={() => setEditingPlant(plant)}
            />
          ))}
        </div>
      </main>

      {/* --- ADD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-10 rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tighter">New Green Friend</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white text-2xl transition">✕</button>
            </div>
            <form onSubmit={handleAddPlant} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Plant Name" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="text" placeholder="Species" className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none" onChange={(e) => setFormData({ ...formData, species: e.target.value })} />
              <input type="number" placeholder="Water Days" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none" onChange={(e) => setFormData({ ...formData, baseWateringDays: e.target.value })} />
              <input type="date" required className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none" onChange={(e) => setFormData({ ...formData, lastWateredDate: e.target.value })} />
              <div className="md:col-span-2">
                <input type="file" accept="image/*" className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-green-500 file:text-white border-none" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
              </div>
              <button type="submit" className="md:col-span-2 bg-green-500 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest">Add to Collection</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MANAGE MODAL --- */}
      {editingPlant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-6 sm:p-10 rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tighter">Manage {editingPlant.name}</h2>
              <button onClick={() => setEditingPlant(null)} className="text-white/50 hover:text-white text-2xl transition">✕</button>
            </div>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-1/2 space-y-6">
                <form onSubmit={handleUpdatePlant} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-white/60 text-sm ml-2">Plant Name</label>
                      <input type="text" value={editingPlant.name} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none" onChange={(e) => setEditingPlant({ ...editingPlant, name: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-white/60 text-sm ml-2">Watering Days</label>
                      <input type="number" value={editingPlant.baseWateringDays} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none" onChange={(e) => setEditingPlant({ ...editingPlant, baseWateringDays: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/60 text-sm ml-2">Change Image (Optional)</label>
                    <input type="file" accept="image/*" className="bg-white/5 border border-white/10 rounded-xl px-5 py-2 text-white text-sm file:bg-green-500 file:rounded-full file:px-4" onChange={(e) => setEditingPlant({ ...editingPlant, newImage: e.target.files[0] })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="submit" className="h-12 bg-green-500 text-white font-black rounded-xl uppercase text-xs">Save Changes</button>
                    <button type="button" onClick={() => setEditingPlant(null)} className="h-12 bg-white/10 text-white font-bold rounded-xl uppercase text-xs">Cancel</button>
                    <button type="button" onClick={() => handleDeletePlant(editingPlant._id)} className="h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl uppercase text-xs">Delete</button>
                    <button type="button" onClick={() => handleReportDeath(editingPlant._id)} className="h-12 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl uppercase text-xs">Report Death</button>
                  </div>
                </form>
              </div>

              {/* CARE CALENDAR */}
              <div className="w-full lg:w-1/2 bg-black/20 p-6 rounded-[2rem] border border-white/5 h-fit">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white tracking-tight">Care Calendar</h3>
                  <div className="hidden sm:flex gap-3 text-[9px] uppercase font-black tracking-tighter">
                    <div className="flex items-center gap-1 text-blue-400">● Watered</div>
                    <div className="flex items-center gap-1 text-red-400">● Missed</div>
                    <div className="flex items-center gap-1 text-green-400">● Next</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['S','M','T','W','T','F','S'].map(day => (
                    <div key={day} className="text-white/20 text-[10px] font-black mb-2">{day}</div>
                  ))}
                  {(() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getUTCMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const calendarDays = [];
                    for (let i = 1; i <= daysInMonth; i++) {
                      const currentDate = new Date(year, month, i);
                      currentDate.setHours(0,0,0,0);
                      let status = 'default';
                      const wasWatered = editingPlant.careHistory?.some(log => new Date(log.date).toDateString() === currentDate.toDateString() && log.actionType === 'Watered');
                      const lastDate = new Date(editingPlant.lastWateredDate);
                      lastDate.setHours(0,0,0,0);
                      const cycle = parseInt(editingPlant.baseWateringDays);
                      const diffInDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                      const isProjected = diffInDays > 0 && diffInDays % cycle === 0;
                      if (wasWatered) status = 'watered';
                      else if (isProjected && currentDate < now) status = 'missed';
                      else if (isProjected && currentDate >= now) status = 'next';
                      calendarDays.push({ day: i, status });
                    }
                    const blanks = Array(firstDay).fill(null);
                    return [...blanks, ...calendarDays].map((item, idx) => (
                      <div key={idx} className={`h-9 w-full flex items-center justify-center rounded-lg text-xs font-bold transition-all ${!item ? '' : item.status === 'watered' ? 'bg-blue-500 text-white' : item.status === 'missed' ? 'bg-red-500/20 text-red-400' : item.status === 'next' ? 'bg-green-500/20 text-green-400 border border-dashed' : 'text-white/40'}`}>
                        {item?.day}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyCollection;