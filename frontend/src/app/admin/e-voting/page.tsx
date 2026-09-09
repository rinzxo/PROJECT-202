"use client";

import React, { useState } from 'react';
import VotersTab from './components/VotersTab';
import CandidatesTab from './components/CandidatesTab';
import SettingsTab from './components/SettingsTab';
import { UsersIcon, UserGroupIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminEVotingPage() {
  const [activeTab, setActiveTab] = useState<'voters' | 'candidates' | 'settings'>('voters');

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen E-Voting</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola data pemilih, kandidat, dan pantau hasil pemilihan secara real-time.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab('voters')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'voters' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UsersIcon className="w-5 h-5" />
          Data Pemilih & Tiket
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'candidates' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserGroupIcon className="w-5 h-5" />
          Kandidat & Visi Misi
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cog6ToothIcon className="w-5 h-5" />
          Pengaturan Tampilan
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'voters' && <VotersTab />}
        {activeTab === 'candidates' && <CandidatesTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
