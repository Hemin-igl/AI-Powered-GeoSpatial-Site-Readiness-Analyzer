import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';
import { CandidateSite, ChatMessage } from '../types';
import { generateAiExplanation } from '../services/gisService';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSite: CandidateSite | null;
  onNavigateTab: (tab: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeSite,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello Rahul! I'm GeoReady AI, your spatial intelligence copilot. I'm currently tracking the Surat Metropolitan Area with focus on ${
        activeSite ? activeSite.name : 'Vesu VIP Cross Road'
      }. How can I assist your site evaluation today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const site = activeSite || {
    id: 'default',
    name: 'Vesu VIP Cross Road',
    area: 'Vesu',
    lat: 21.1448,
    lng: 72.7758,
    businessType: 'Retail Store',
    readinessScore: 82,
    status: 'High Potential',
    factors: {
      population: 91,
      accessibility: 87,
      competition: 63,
      landUse: 95,
      environmentalRisk: 78,
    },
    metrics: {
      populationWithin5km: 186400,
      populationDensity: 12480,
      nearestHighwayKm: 1.4,
      nearestMajorRoadMeters: 420,
      competitorsWithin1km: 2,
      competitorsWithin3km: 5,
      competitorsWithin5km: 11,
      medianIncomeMonthly: 78500,
      zoningCode: 'C-2 High Commercial',
      floodRiskLevel: 'Low',
    },
    summary: 'High commercial demand corridor with strong foot traffic.',
  } as CandidateSite;

  const suggestedQuestions = [
    'Why does this site have this score?',
    'Find areas with high population and low competition.',
    'Explain the accessibility of this site.',
    'What factors are reducing the score?',
    'Compare these candidate sites.',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      let suggestedAction: { label: string; targetPage: string } | undefined;

      const lower = query.toLowerCase();

      if (lower.includes('why') && lower.includes('score')) {
        responseText = generateAiExplanation(site, 'explain');
        suggestedAction = { label: 'Inspect Score Breakdown', targetPage: 'site-analysis' };
      } else if (lower.includes('weakness') || lower.includes('reducing') || lower.includes('limiting')) {
        responseText = generateAiExplanation(site, 'weaknesses');
        suggestedAction = { label: 'Check Competition Decay', targetPage: 'competition' };
      } else if (lower.includes('accessibility') || lower.includes('transit') || lower.includes('road')) {
        responseText = `Accessibility breakdown for ${site.name}:
• Road Accessibility Index: ${site.factors.accessibility}/100
• Arterial Connectivity: Located ${site.metrics.nearestMajorRoadMeters}m from Surat Gaurav Path.
• Regional Highway: Nearest interchange is ${site.metrics.nearestHighwayKm} km away.
• Catchment Reach: 18,400 people are reachable within a 10-minute drive, expanding to 64,200 people within 20 minutes and 142,700 people in 30 minutes.`;
        suggestedAction = { label: 'View Isochrone Map', targetPage: 'accessibility' };
      } else if (lower.includes('high population') || lower.includes('find areas') || lower.includes('opportunity')) {
        responseText = `Spatial analysis query matched 3 prime micro-zones in Surat:
1. Vesu VIP Corridor (Readiness: 82/100, Pop: 186k within 5km)
2. Adajan Palika Complex (Readiness: 86/100, Pop: 214k within 5km)
3. Althan Canal Road (Readiness: 83/100, Pop: 198k within 5km)

All three feature high demographic density with manageable competitor clustering.`;
        suggestedAction = { label: 'Open Opportunity Map', targetPage: 'opportunity-map' };
      } else if (lower.includes('compare')) {
        responseText = `Multi-site comparison matrix ready:
• Site A (Vesu VIP): Balanced retail flagship candidate, high income tier.
• Site B (Adajan Pal): Peak accessibility score (94/100) and lowest road friction.
• Site C (Dumas Tech Corridor): Ideal EV infrastructure & fast throughput corridor.`;
        suggestedAction = { label: 'Open Compare Matrix', targetPage: 'compare-sites' };
      } else {
        responseText = `Spatial intelligence summary for ${site.name}:
Based on multi-criteria GIS evaluation, this site shows an aggregate Readiness Score of ${site.readinessScore}/100 (${site.status}). It benefits from a strong population density factor (${site.factors.population}/100) and commercial zoning code (${site.metrics.zoningCode}).`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: 'Just now',
        suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5">
              GeoReady AI
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">
                Copilot
              </span>
            </h2>
            <p className="text-[10px] text-indigo-100">
              Context: {site.name} ({site.readinessScore}/100)
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="h-80 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 custom-scrollbar text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="max-w-[84%] space-y-2">
              <div
                className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-100 shadow-xs rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>

              {msg.suggestedAction && (
                <button
                  onClick={() => {
                    onNavigateTab(msg.suggestedAction!.targetPage);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-semibold text-[11px] transition-colors border border-indigo-200/60"
                >
                  <span>{msg.suggestedAction.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center text-slate-400 text-xs pl-8">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-[11px] ml-1">Analyzing Surat spatial metrics...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions Carousel */}
      <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto custom-scrollbar flex gap-1.5">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="shrink-0 text-[10px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 rounded-lg text-slate-600 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask spatial intelligence questions..."
          className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
        />
        <button
          onClick={() => handleSend()}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
