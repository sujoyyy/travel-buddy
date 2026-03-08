"use client";
import React from 'react';

export default function GlobeComponent() {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden bg-[#020617]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-60" // Opacity increased for clarity
      >
        <source src="/globe.mp4" type="video/mp4" />
      </video>
      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#020617]/80" />
    </div>
  );
}