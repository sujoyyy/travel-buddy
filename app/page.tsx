"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const GlobeComponent = dynamic(() => import("../components/GlobeComponent"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#020617]" /> 
});

const Typewriter = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText(""); 
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 5); 
    return () => clearInterval(timer);
  }, [text]);

  return <p>{displayedText}</p>;
};

export default function Home() {
  const [location, setLocation] = useState("");
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const planTrip = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ location, mood, budget }),
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      setResponse("Network issue detected. Systems offline.");
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-transparent text-white flex flex-col items-center justify-start py-12 px-4 overflow-x-hidden">
      <GlobeComponent />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold py-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
            TravelBuddy AI
          </h1>
          <p className="mt-2 text-emerald-100 opacity-60 font-medium tracking-[0.3em] uppercase text-xs">
            Destination tumhara, plan humara
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-emerald-200 uppercase tracking-widest font-bold ml-1">Location</label>
              <input
                type="text"
                placeholder="Where to?"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all text-sm"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-emerald-200 uppercase tracking-widest font-bold ml-1">Vibe</label>
              <input
                type="text"
                placeholder="How are you feeling?"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all text-sm"
                onChange={(e) => setMood(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-emerald-200 uppercase tracking-widest font-bold ml-1">Budget (INR)</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-all text-sm"
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          
          <button
            onClick={planTrip}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Calculating..." : "Generate Travel Plan"}
          </button>
        </div>

        {response && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h2 className="text-emerald-300 font-bold mb-4 text-xs tracking-[0.2em] uppercase flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
               Analysis Result:
            </h2>
            <div className="text-white/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap border-t border-white/10 pt-6">
              <Typewriter text={response} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}