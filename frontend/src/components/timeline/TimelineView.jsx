import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  Clock, 
  Calendar, 
  Phone, 
  CreditCard, 
  Eye, 
  FileText, 
  ShieldAlert, 
  Filter,
  ArrowRight
} from 'lucide-react';

const EVENT_ICONS = {
  CASE_MILESTONE: FileText,
  COMMUNICATION: Phone,
  PHYSICAL_SURVEILLANCE: Eye,
  FINANCIAL_TRANSACTION: CreditCard
};

const SEVERITY_COLORS = {
  CRITICAL: 'bg-red-950 text-red-400 border-red-800',
  HIGH: 'bg-amber-950 text-amber-400 border-amber-800',
  MEDIUM: 'bg-blue-950 text-blue-400 border-blue-800',
  LOW: 'bg-slate-800 text-slate-400 border-slate-700'
};

export default function TimelineView() {
  const { inspectEvidence, selectEntityById, showToast } = useInvestigation();
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTimelineEvents();
        setEvents(data);
      } catch (e) {
        showToast('Failed to load timeline: ' + e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = filterType === 'ALL' ? events : events.filter(e => e.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Chronological Investigation Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Temporal correlation across telecom CDR intercepts, physical surveillance sightings, and wire transfers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'FINANCIAL_TRANSACTION', 'COMMUNICATION', 'PHYSICAL_SURVEILLANCE', 'CASE_MILESTONE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
        {filteredEvents.map((evt) => {
          const IconComp = EVENT_ICONS[evt.type] || Clock;
          const dateStr = new Date(evt.timestamp).toLocaleString();

          return (
            <div key={evt.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 transition" />

              {/* Event Card */}
              <div className="p-4 rounded-2xl glass-panel border border-slate-800/90 hover:border-cyan-500/40 transition space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${SEVERITY_COLORS[evt.severity]}`}>
                      {evt.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                  </div>

                  {evt.evidence_id && (
                    <button
                      onClick={() => inspectEvidence(evt.evidence_id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[11px] font-mono border border-slate-800 flex items-center gap-1 transition"
                    >
                      <FileText className="w-3 h-3" /> Inspect Evidence ({evt.evidence_id})
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-cyan-400" />
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {evt.description}
                </p>

                {/* Linked Entities */}
                {evt.entities && evt.entities.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Linked Subjects:</span>
                    {evt.entities.map((entId) => (
                      <span
                        key={entId}
                        onClick={() => selectEntityById(entId)}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] rounded cursor-pointer border border-slate-800"
                      >
                        {entId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
