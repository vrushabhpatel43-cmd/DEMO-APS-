import React, { useState } from 'react';
import type { DailyReport, SiteVisit, CompletedSiteVisit, Lead } from '../types';
import { Button } from './Button';
import { InputField } from './InputField';

interface EodReportFormProps {
  onSubmit: (data: Omit<DailyReport, 'date' | 'telecallerName'>) => void;
}

export const EodReportForm: React.FC<EodReportFormProps> = ({ onSubmit }) => {
  const [cpFirmDialingFor, setCpFirmDialingFor] = useState('');
  const [callsDialed, setCallsDialed] = useState(0);
  const [callsConnected, setCallsConnected] = useState(0);
  const [projectsExplained, setProjectsExplained] = useState(0);
  const [scheduledVisits, setScheduledVisits] = useState<SiteVisit[]>([]);
  const [completedVisits, setCompletedVisits] = useState<CompletedSiteVisit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Generic functions for managing dynamic lists
  const addItem = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, newItem: T) => {
    setter(prev => [...prev, newItem]);
  };

  const removeItem = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = <T,>(setter: React.Dispatch<React.SetStateAction<(T & { id: string })[]>>, id: string, field: keyof T, value: any) => {
    setter(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cpFirmDialingFor,
      callsDialed,
      callsConnected,
      projectsExplained,
      scheduledVisits,
      completedVisits,
      leads,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-cyan-300 border-b border-slate-600 pb-2">Daily Stats</h2>
        <InputField id="cpFirm" label="CP Firm Name (Dialing For)" value={cpFirmDialingFor} onChange={e => setCpFirmDialingFor(e.target.value)} type="text" placeholder="Enter CP Firm Name" required />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField id="dialed" label="Clients Dialed" value={callsDialed} onChange={e => setCallsDialed(Number(e.target.value))} type="number" min="0" />
          <InputField id="connected" label="Calls Connected" value={callsConnected} onChange={e => setCallsConnected(Number(e.target.value))} type="number" min="0" />
          <InputField id="explained" label="Projects Explained" value={projectsExplained} onChange={e => setProjectsExplained(Number(e.target.value))} type="number" min="0" />
        </div>
      </div>

      {/* Site Visits Scheduled */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-600 pb-2">
          <h2 className="text-2xl font-semibold text-cyan-300">Site Visits Scheduled</h2>
          <Button type="button" onClick={() => addItem(setScheduledVisits, { id: crypto.randomUUID(), clientName: '', cpFirm: '', clientContact: '' })} className="px-4 py-2 text-sm">+</Button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {scheduledVisits.map(v => (
            <div key={v.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-900/50 p-3 rounded-lg">
              <InputField id={`sv-name-${v.id}`} placeholder="Client Name" value={v.clientName} onChange={e => updateItem(setScheduledVisits, v.id, 'clientName', e.target.value)} label="Client Name" />
              <InputField id={`sv-cp-${v.id}`} placeholder="CP Firm" value={v.cpFirm} onChange={e => updateItem(setScheduledVisits, v.id, 'cpFirm', e.target.value)} label="CP Firm" />
              <InputField id={`sv-contact-${v.id}`} placeholder="Contact No" value={v.clientContact} onChange={e => updateItem(setScheduledVisits, v.id, 'clientContact', e.target.value)} label="Client Contact" />
              <button type="button" onClick={() => removeItem(setScheduledVisits, v.id)} className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors h-full w-full">X</button>
            </div>
          ))}
        </div>
      </div>

      {/* Site Visits Completed */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-600 pb-2">
          <h2 className="text-2xl font-semibold text-cyan-300">Site Visits Completed Today</h2>
          <Button type="button" onClick={() => addItem(setCompletedVisits, { id: crypto.randomUUID(), clientName: '', cpFirm: '', clientContact: '', status: 'Follow-up' })} className="px-4 py-2 text-sm">+</Button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {completedVisits.map(v => (
            <div key={v.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-slate-900/50 p-3 rounded-lg">
              <InputField id={`cv-name-${v.id}`} placeholder="Client Name" value={v.clientName} onChange={e => updateItem(setCompletedVisits, v.id, 'clientName', e.target.value)} label="Client Name" />
              <InputField id={`cv-cp-${v.id}`} placeholder="CP Firm" value={v.cpFirm} onChange={e => updateItem(setCompletedVisits, v.id, 'cpFirm', e.target.value)} label="CP Firm" />
              <InputField id={`cv-contact-${v.id}`} placeholder="Contact No" value={v.clientContact} onChange={e => updateItem(setCompletedVisits, v.id, 'clientContact', e.target.value)} label="Client Contact" />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select value={v.status} onChange={e => updateItem(setCompletedVisits, v.id, 'status', e.target.value)} className="w-full p-3 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 h-[50px]">
                  <option>Selected</option><option>Follow-up</option><option>Not Interested</option>
                </select>
              </div>
              <button type="button" onClick={() => removeItem(setCompletedVisits, v.id)} className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors h-full w-full">X</button>
            </div>
          ))}
        </div>
      </div>

      {/* New Leads */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-600 pb-2">
          <h2 className="text-2xl font-semibold text-cyan-300">New Leads / Notes</h2>
          <Button type="button" onClick={() => addItem(setLeads, { id: crypto.randomUUID(), clientName: '', contactInfo: '', notes: '' })} className="px-4 py-2 text-sm">+</Button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {leads.map(lead => (
            <div key={lead.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr_auto] gap-4 items-end bg-slate-900/50 p-3 rounded-lg">
              <InputField id={`lead-name-${lead.id}`} placeholder="Client Name" value={lead.clientName} onChange={e => updateItem(setLeads, lead.id, 'clientName', e.target.value)} label="Client Name" />
              <InputField id={`lead-contact-${lead.id}`} placeholder="Contact Info" value={lead.contactInfo} onChange={e => updateItem(setLeads, lead.id, 'contactInfo', e.target.value)} label="Contact Info" />
              <InputField id={`lead-notes-${lead.id}`} placeholder="Notes" value={lead.notes} onChange={e => updateItem(setLeads, lead.id, 'notes', e.target.value)} label="Notes" />
              <button type="button" onClick={() => removeItem(setLeads, lead.id)} className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors h-full w-full">X</button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">Submit EOD Report</Button>
      </div>
    </form>
  );
};