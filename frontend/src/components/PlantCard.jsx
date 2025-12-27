import React, { useState } from 'react';

const PlantCard = ({ id, name, lastWateredDate, baseWateringDays, imageUrl, onWaterSuccess, onManageClick }) => {
    const [isWatering, setIsWatering] = useState(false);

    // --- CALCULATION LOGIC ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWatered = new Date(lastWateredDate);
    lastWatered.setHours(0, 0, 0, 0);

    const isWateredToday = lastWatered.getTime() === today.getTime();

    const nextWaterDate = new Date(lastWatered);
    nextWaterDate.setDate(lastWatered.getDate() + baseWateringDays);

    const diffInTime = nextWaterDate.getTime() - today.getTime();
    const daysUntilWater = Math.ceil(diffInTime / (1000 * 3600 * 24));

    const isEmergency = daysUntilWater <= 0 && !isWateredToday;

    const handleQuickWater = async () => {
        if (isWateredToday) return;
        setIsWatering(true);
        try {
            const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lastWateredDate: new Date(),
                    $push: {
                        careHistory: { actionType: 'Watered', date: new Date(), notes: 'Quick watered' }
                    }
                })
            });

            if (response.ok) {
                // Trigger the refresh function from parent
                onWaterSuccess();
            }
        } catch (err) {
            console.error("Watering error:", err);
        } finally {
            setIsWatering(false);
        }
    };

    return (
        <div className={`group backdrop-blur-md border rounded-[2.5rem] overflow-hidden transition shadow-2xl
      ${isEmergency
                ? 'bg-red-500/20 border-red-500/40 hover:border-red-500/60'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}
    `}>

            <div className={`h-64 relative transition-colors overflow-hidden
        ${isEmergency ? 'bg-red-900/40' : 'bg-green-900/40 group-hover:bg-green-900/30'}
      `}>
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 italic">No Image</div>
                )}

                <div className={`absolute bottom-4 left-4 backdrop-blur-md px-4 py-1 rounded-full text-white text-xs uppercase tracking-widest font-bold
          ${isEmergency ? 'bg-red-600/60' : 'bg-black/40'}
        `}>
                    {isWateredToday
                        ? "Watered for Today"
                        : daysUntilWater <= 0
                            ? "Needs Water Today!"
                            : `Needs water in ${daysUntilWater} days`
                    }
                </div>
            </div>

            <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
                <p className={`text-sm font-medium mb-6 ${isEmergency ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                    Status: {isWateredToday ? 'Satisfied' : isEmergency ? 'Emergency: Thirsty' : 'Healthy'}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onManageClick} // Trigger the edit modal in MyCollection.jsx
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition border border-white/5 active:scale-95"
                    >
                        Manage Plant
                    </button>

                    <button
                        onClick={handleQuickWater}
                        disabled={isWatering || isWateredToday}
                        className={`w-full py-3 rounded-xl font-bold transition border active:scale-95 shadow-lg
              ${isWateredToday
                                ? 'bg-gray-500/20 border-white/5 text-gray-500 cursor-not-allowed'
                                : isEmergency
                                    ? 'bg-red-600/80 hover:bg-red-500 text-white border-red-400/50'
                                    : 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border-white/10'}
            `}
                    >
                        {isWatering ? 'Updating...' : isWateredToday ? 'Watered' : 'Water For Today'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlantCard;