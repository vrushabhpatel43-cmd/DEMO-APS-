export interface SiteVisit {
  id: string; // For React key prop
  clientName: string;
  cpFirm: string;
  clientContact: string;
}

export interface CompletedSiteVisit extends SiteVisit {
  status: 'Selected' | 'Not Interested' | 'Follow-up';
}

export interface Lead {
  id: string;
  clientName: string;
  contactInfo: string;
  notes: string;
}

export interface DailyReport {
  date: string; // ISO string for date tracking
  telecallerName: string;
  cpFirmDialingFor: string;
  callsDialed: number;
  callsConnected: number;
  projectsExplained: number;
  scheduledVisits: SiteVisit[];
  completedVisits: CompletedSiteVisit[];
  leads: Lead[];
}

export interface User {
  email: string;
  name: string;
  role: 'telecaller' | 'manager';
}