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
  ArrowRight,
  Sparkles
} from 'lucide-react';

const EVENT_ICONS = {
  CASE_MILESTONE: FileText,
  COMMUNICATION: Phone,
  PHYSICAL_SURVEILLANCE: Eye,
  FINANCIAL_TRANSACTION: CreditCard
};

const SEVERITY_COLORS = {
  CRITICAL: 'bg-red-950/80 text-red-300 border-red-700 font-bold',
  HIGH: 'bg-amber-950/80 text-amber-300 border-amber-700 font-bold',
  MEDIUM: 'bg-blue-950/80 text-blue-300 border-blue-700 font-medium',
  LOW: 'bg-slate-900 text-slate-400 border-slate-700 font-medium'
};

const TYPE_BADGE_COLORS = {
  FINANCIAL_TRANSACTION: 'text-amber-400 border-amber-800 bg-amber-950/40',
  COMMUNICATION: 'text-emerald-400 border-emerald-800 bg-emerald-950/40',
  PHYSICAL_SURVEILLANCE: 'text-rose-400 border-rose-800 bg-rose-950/40',
  CASE_MILESTONE: 'text-cyan-400 border-cyan-800 bg-cyan-950/40'
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
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 shadow-sm shadow-cyan-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <span>Chronological Investigation Timeline & Sequence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 pl-11">
            Multi-source temporal correlation linking CDR phone calls, physical surveillance intercepts, and rapid wire transactions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['ALL', 'FINANCIAL_TRANSACTION', 'COMMUNICATION', 'PHYSICAL_SURVEILLANCE', 'CASE_MILESTONE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterType === type
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {type === 'ALL' ? 'All Events' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800/80 space-y-6 ml-3">
        {filteredEvents.map((evt) => {
          const IconComp = EVENT_ICONS[evt.type] || Clock;
          const dateStr = new Date(evt.timestamp).toLocaleString();
          const typeBadgeStyle = TYPE_BADGE_COLORS[evt.type] || 'text-cyan-400 border-cyan-800 bg-cyan-950/40';

          return (
            <div key={evt.id} className="relative group">
              {/* Glowing Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300" />

              {/* Event Card */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-800/90 hover:border-cyan-500/50 transition-all space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono border ${typeBadgeStyle}`}>
                      {evt.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono border ${SEVERITY_COLORS[evt.severity]}`}>
                      {evt.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {dateStr}
                    </span>
                  </div>

                  {evt.evidence_id && (
                    <button
                      onClick={() => inspectEvidence(evt.evidence_id)}
                      className="px-3 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-mono border border-cyan-700/80 flex items-center gap-1.5 transition shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Evidence ({evt.evidence_id})</span>
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-white flex items-center gap-2.5 tracking-tight">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span>{evt.title}</span>
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {evt.description}
                </p>

                {/* Linked Subjects */}
                {evt.entities && evt.entities.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold mr-1">
                      Linked Subjects:
                    </span>
                    {evt.entities.map((entId) => (
                      <span
                        key={entId}
                        onClick={() => selectEntityById(entId)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[11px] rounded-lg cursor-pointer border border-slate-800 font-mono transition hover:border-cyan-500/50"
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
