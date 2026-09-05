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
  CRITICAL: 'bg-red-50 text-red-800 border-red-300 font-bold',
  HIGH: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
  MEDIUM: 'bg-sky-50 text-sky-800 border-sky-300 font-semibold',
  LOW: 'bg-slate-50 text-slate-700 border-slate-300 font-medium'
};

const TYPE_BADGE_COLORS = {
  FINANCIAL_TRANSACTION: 'text-amber-900 border-amber-300 bg-amber-50',
  COMMUNICATION: 'text-emerald-900 border-emerald-300 bg-emerald-50',
  PHYSICAL_SURVEILLANCE: 'text-rose-900 border-rose-300 bg-rose-50',
  CASE_MILESTONE: 'text-sky-900 border-sky-300 bg-sky-50'
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
    <div className="space-y-5">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#003366] tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <span>Chronological Investigation Timeline & Sequence</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 pl-11">
            Multi-source temporal correlation linking CDR phone calls, physical surveillance intercepts, and rapid wire transactions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs">
          {['ALL', 'FINANCIAL_TRANSACTION', 'COMMUNICATION', 'PHYSICAL_SURVEILLANCE', 'CASE_MILESTONE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterType === type
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-sky-900 hover:bg-white'
              }`}
            >
              {type === 'ALL' ? 'All Events' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-sky-200 space-y-5 ml-3">
        {filteredEvents.map((evt) => {
          const IconComp = EVENT_ICONS[evt.type] || Clock;
          const dateStr = new Date(evt.timestamp).toLocaleString();
          const typeBadgeStyle = TYPE_BADGE_COLORS[evt.type] || 'text-sky-900 border-sky-300 bg-sky-50';

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-white border-2 border-sky-600 shadow-xs transition-all duration-300" />

              {/* Event Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-300 hover:border-sky-400 transition-all space-y-2.5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${typeBadgeStyle}`}>
                      {evt.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] border ${SEVERITY_COLORS[evt.severity]}`}>
                      {evt.severity}
                    </span>
                    <span className="text-xs text-slate-700 flex items-center gap-1.5 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" /> {dateStr}
                    </span>
                  </div>

                  {evt.evidence_id && (
                    <button
                      onClick={() => inspectEvidence(evt.evidence_id)}
                      className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs border border-sky-300 flex items-center gap-1.5 font-medium transition shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Evidence ({evt.evidence_id})</span>
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1 rounded bg-sky-50 border border-sky-200 text-sky-700">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span>{evt.title}</span>
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {evt.description}
                </p>

                {/* Linked Subjects */}
                {evt.entities && evt.entities.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-bold mr-1">
                      Linked Subjects:
                    </span>
                    {evt.entities.map((entId) => (
                      <span
                        key={entId}
                        onClick={() => selectEntityById(entId)}
                        className="px-2 py-0.5 bg-white hover:bg-sky-50 text-sky-900 text-[11px] rounded cursor-pointer border border-sky-200 font-mono transition"
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
