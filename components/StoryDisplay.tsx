import React, { useState, useEffect } from 'react';
import type { DailyReport, SiteVisit, CompletedSiteVisit, Lead } from '../types';
import { Button } from './Button';
import { generateReportSummary } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface ReportSummaryProps {
  report: DailyReport;
  onShowForm: () => void;
  onShowDashboard: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-slate-900 p-4 rounded-lg text-center shadow-md">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-2xl font-bold text-cyan-300">{value}</p>
  </div>
);

const VisitDetails: React.FC<{ visit: SiteVisit | CompletedSiteVisit }> = ({ visit }) => (
  <li className="p-3 bg-slate-800/50 rounded-md border border-slate-700">
    <p className="font-semibold text-white">{visit.clientName}</p>
    <p className="text-sm text-slate-400">CP Firm: {visit.cpFirm}</p>
    <p className="text-sm text-slate-400">Contact: {visit.clientContact}</p>
    {'status' in visit && <p className="text-sm font-medium text-purple-400 mt-1">Status: {visit.status}</p>}
  </li>
);

const LeadDetails: React.FC<{ lead: Lead }> = ({ lead }) => (
    <li className="p-3 bg-slate-800/50 rounded-md border border-slate-700">
      <p className="font-semibold text-white">{lead.clientName}</p>
      <p className="text-sm text-slate-400">Contact: {lead.contactInfo}</p>
      <p className="text-sm text-slate-300 mt-1">Notes: {lead.notes}</p>
    </li>
  );

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report, onShowForm, onShowDashboard }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        setError('');
        const generatedSummary = await generateReportSummary(report);
        setSummary(generatedSummary);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred while generating summary.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [report]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-center text-cyan-300">EOD Report Summary</h2>
        <p className="text-center text-slate-400">
          For CP Firm: <span className="font-semibold text-white">{report.cpFirmDialingFor}</span> on {new Date(report.date).toLocaleDateString()}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-cyan-300 mb-3">AI-Generated Summary</h3>
        <div className="p-4 bg-slate-900 rounded-md border border-slate-700 min-h-[120px] flex items-center justify-center">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <p className="text-slate-300 whitespace-pre-wrap">{summary}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Clients Dialed" value={report.callsDialed} />
        <StatCard label="Calls Connected" value={report.callsConnected} />
        <StatCard label="Projects Explained" value={report.projectsExplained} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-cyan-300 mb-3">Site Visits Scheduled ({report.scheduledVisits.length})</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{report.scheduledVisits.map(v => <VisitDetails key={v.id} visit={v} />)}</ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-cyan-300 mb-3">Site Visits Completed ({report.completedVisits.length})</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{report.completedVisits.map(v => <VisitDetails key={v.id} visit={v} />)}</ul>
        </div>
      </div>
      
      {report.leads.length > 0 && (
        <div>
           <h3 className="text-xl font-semibold text-cyan-300 mb-3">Leads / Notes ({report.leads.length})</h3>
           <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">{report.leads.map(l => <LeadDetails key={l.id} lead={l} />)}</ul>
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
        <Button onClick={onShowForm}>Create New Report</Button>
        <Button onClick={onShowDashboard} className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800">View Dashboard</Button>
      </div>
    </div>
  );
};