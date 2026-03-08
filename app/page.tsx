"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const GlobeComponent = dynamic(() => import("../components/GlobeComponent"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#020617]" /> 
});

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ from: "", to: "", days: "1", budget: "" });
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  const planTrip = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ 
          fromLocation: form.from, 
          toLocation: form.to, 
          days: form.days, 
          budget: form.budget 
        }),
      });
      setData(await res.json());
    } catch (e) { 
      console.error(e); 
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-black font-sans relative">
      <div className="fixed inset-0 z-0">
        <GlobeComponent />
      </div>
      
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="w-10 flex flex-col gap-1.5 cursor-pointer">
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </div>
        <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
          TravelBuddy AI
        </h1>
        <div className="w-10"></div>
      </nav>

      <div className="relative z-10 w-full max-w-xl mx-auto mt-32 px-6 pb-20 space-y-12">
        {/* Input Form Card */}
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 space-y-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/60 ml-1">From</label>
              <input 
                type="text" 
                placeholder="Starting City" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-emerald-500/50" 
                onChange={(e)=>setForm({...form, from: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/60 ml-1">Destination</label>
              <input 
                type="text" 
                placeholder="To City" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-emerald-500/50" 
                onChange={(e)=>setForm({...form, to: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/60 ml-1">Days</label>
              <input 
                type="number" 
                placeholder="Duration" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-emerald-500/50" 
                onChange={(e)=>setForm({...form, days: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/60 ml-1">Budget</label>
              <input 
                type="number" 
                placeholder="Amount in INR" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-emerald-500/50" 
                onChange={(e)=>setForm({...form, budget: e.target.value})} 
              />
            </div>
          </div>
          <button 
            onClick={planTrip} 
            disabled={loading} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 p-5 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Planning..." : "Get Plan"}
          </button>
        </div>

        {/* Result Card with Identical Glassmorphism */}
        {data && (
          <div ref={resultRef} className="bg-white/5 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 space-y-12 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <p className="text-center text-white/50 italic text-lg leading-relaxed px-4">
              "{data.intro}"
            </p>
            
            <div className="space-y-16">
              {data.places.map((place: any, i: number) => (
                <div key={i} className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-emerald-50">
                      {i + 1}. {place.name}
                    </h3>
                    <a 
                      href={place.mapUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                    >
                      <img 
                        src="https://www.google.com/images/branding/product/2x/maps_96dp.png" 
                        alt="Map" 
                        className="w-4 h-4" 
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">View on Maps</span>
                    </a>
                  </div>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {place.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/10 space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/60">Local Recommendation</p>
                <p className="text-lg font-medium">{data.food}</p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500/60">Budget Calculation</p>
                <ul className="text-sm text-white/40 space-y-3 list-disc pl-4">
                  {data.budgetDetails.map((item: any, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-emerald-400 font-bold text-lg">
                    Total Estimated Expense: {data.totalBudget || `within ₹${form.budget}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="relative z-10 w-full py-10 text-center text-[10px] text-white/20 uppercase tracking-[0.4em] border-t border-white/5 mt-auto">
        Build by-Sujoy Dey • insta-@mr.sujoydey
      </footer>
    </div>
  );
}