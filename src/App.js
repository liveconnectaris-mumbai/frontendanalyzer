import { useState } from "react";
import "@/App.css";
import axios from "axios";
import { 
  Loader2, Globe, Search, Copy, Check, ChevronDown, ChevronUp, 
  AlertCircle, ExternalLink, Trophy, TrendingUp, Lightbulb, BarChart3,
  Zap, Gauge, Clock, FileCode, Image, Code2, Shield, Server,
  CheckCircle2, XCircle, AlertTriangle, Rocket, Database, Wifi,
  HardDrive, Timer, Activity, PieChart, Award, Eye, Target,
  MousePointer, Layout, Focus, Layers, Crosshair, MapPin,
  FileText, Sparkles, ListChecks, PenTool, Type, MessageSquare, BookOpen
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Trust Signal Badge Component
const TrustBadge = ({ label, detected }) => (
  <span
    data-testid={`trust-badge-${label.toLowerCase().replace(/\s+/g, '-')}`}
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      detected
        ? "bg-green-100 text-green-800 border border-green-200"
        : "bg-gray-100 text-gray-500 border border-gray-200"
    }`}
  >
    {detected ? "✓" : "✗"} {label}
  </span>
);

// Status Badge Component
const StatusBadge = ({ label, value, goodValues = [] }) => {
  const isGood = goodValues.includes(value) || value === true;
  const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : value;

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span
        data-testid={`status-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className={`px-2 py-0.5 rounded text-xs font-medium ${
          isGood
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {displayValue}
      </span>
    </div>
  );
};

// Performance Indicator Badge
const PerfBadge = ({ label, enabled, goodWhenTrue = true, count = null }) => {
  const isGood = goodWhenTrue ? enabled : !enabled;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      isGood ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
    }`}>
      {isGood ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm font-medium ${isGood ? "text-green-800" : "text-red-800"}`}>
        {label}
        {count !== null && <span className="ml-1 text-xs opacity-75">({count})</span>}
      </span>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, value, unit, label, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    pink: "text-pink-600",
    cyan: "text-cyan-600",
    green: "text-green-600",
    amber: "text-amber-600",
    orange: "text-orange-600"
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <Icon className={`w-6 h-6 ${colorClasses[color]} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
};

// Resource Breakdown Bar
const ResourceBar = ({ breakdown }) => {
  const total = Object.values(breakdown || {}).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const segments = [
    { key: 'html_kb', label: 'HTML', color: 'bg-blue-500' },
    { key: 'css_kb', label: 'CSS', color: 'bg-purple-500' },
    { key: 'javascript_kb', label: 'JS', color: 'bg-yellow-500' },
    { key: 'images_kb', label: 'Images', color: 'bg-pink-500' },
    { key: 'fonts_kb', label: 'Fonts', color: 'bg-cyan-500' },
    { key: 'other_kb', label: 'Other', color: 'bg-gray-400' },
  ];

  return (
    <div className="space-y-2">
      <div className="h-4 rounded-full overflow-hidden flex bg-gray-200">
        {segments.map(seg => {
          const percent = (breakdown?.[seg.key] || 0) / total * 100;
          if (percent < 0.5) return null;
          return (
            <div
              key={seg.key}
              className={`${seg.color} transition-all`}
              style={{ width: `${percent}%` }}
              title={`${seg.label}: ${(breakdown?.[seg.key] || 0).toFixed(1)} KB (${percent.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        {segments.map(seg => (
          <div key={seg.key} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${seg.color}`} />
            <span className="text-gray-600">{seg.label}: {(breakdown?.[seg.key] || 0).toFixed(1)} KB</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Detailed Fix Card Component - Developer Guide Style
const DetailedFixCard = ({ fix, priority, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  
  // Handle both old string format and new detailed format
  const isDetailed = typeof fix === 'object' && fix.issue;
  const issue = isDetailed ? fix.issue : fix;
  const whyItMatters = isDetailed ? fix.why_it_matters : '';
  const howToFix = isDetailed ? fix.how_to_fix : [];
  const codeExample = isDetailed ? fix.code_example : '';
  const expectedImpact = isDetailed ? fix.expected_impact : '';
  const difficulty = isDetailed ? fix.difficulty : 'medium';
  const timeEstimate = isDetailed ? fix.time_estimate : '';
  
  const priorityColors = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', accent: 'text-red-600', badge: 'bg-red-100 text-red-800' },
    high: { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' },
    medium: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
    quick: { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600', badge: 'bg-green-100 text-green-800' }
  };
  
  const colors = priorityColors[priority] || priorityColors.medium;
  
  const difficultyBadge = {
    easy: { color: 'bg-green-100 text-green-800', label: '🟢 Easy' },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: '🟡 Medium' },
    hard: { color: 'bg-red-100 text-red-800', label: '🔴 Hard' }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };
  
  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl overflow-hidden`}>
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-white/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-7 h-7 rounded-full ${colors.badge} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
              {index}
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900 text-sm">{issue}</h5>
              {expectedImpact && (
                <p className={`text-xs ${colors.accent} mt-1 font-medium`}>
                  💡 {expectedImpact}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {timeEstimate && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeEstimate}
              </span>
            )}
            {difficulty && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyBadge[difficulty]?.color || difficultyBadge.medium.color}`}>
                {difficultyBadge[difficulty]?.label || difficulty}
              </span>
            )}
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && isDetailed && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* Why It Matters */}
          {whyItMatters && (
            <div>
              <h6 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Why This Matters
              </h6>
              <p className="text-sm text-gray-700 bg-white/70 rounded-lg p-3">
                {whyItMatters}
              </p>
            </div>
          )}
          
          {/* How To Fix */}
          {howToFix && howToFix.length > 0 && (
            <div>
              <h6 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> How To Fix (Step by Step)
              </h6>
              <ol className="space-y-2">
                {howToFix.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`w-5 h-5 rounded-full ${colors.badge} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Code Example */}
          {codeExample && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h6 className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> Code Example
                </h6>
                <button
                  onClick={handleCopyCode}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/50"
                >
                  {codeCopied ? (
                    <><Check className="w-3 h-3 text-green-600" /> Copied!</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy Code</>
                  )}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono">
                {codeExample}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Score Bar Component
const ScoreBar = ({ label, scoreA, scoreB, winnerLabel }) => {
  const maxScore = 10;
  const aPercent = (scoreA / maxScore) * 100;
  const bPercent = (scoreB / maxScore) * 100;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          winnerLabel === "Site A" ? "bg-indigo-100 text-indigo-700" :
          winnerLabel === "Site B" ? "bg-purple-100 text-purple-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {winnerLabel === "Tie" ? "Tie" : `${winnerLabel} wins`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Site A</span>
            <span>{scoreA}/10</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${aPercent}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Site B</span>
            <span>{scoreB}/10</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${bPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Comparison Summary Card
const ComparisonCard = ({ comparison }) => {
  if (!comparison) return null;

  const { summary, scores, category_winners, improvement_suggestions } = comparison;
  
  const totalA = scores?.site_a ? 
    Object.values(scores.site_a).reduce((a, b) => a + b, 0) : 0;
  const totalB = scores?.site_b ? 
    Object.values(scores.site_b).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className={`px-6 py-5 ${
        summary?.overall_winner === "Site A" 
          ? "bg-gradient-to-r from-indigo-500 to-indigo-600" 
          : summary?.overall_winner === "Site B"
          ? "bg-gradient-to-r from-purple-500 to-purple-600"
          : "bg-gradient-to-r from-gray-500 to-gray-600"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                {summary?.overall_winner === "Tie" ? "It's a Tie!" : `${summary?.overall_winner} Wins!`}
              </h3>
              <span className="text-white/80 text-sm">({totalA} vs {totalB} total points)</span>
            </div>
            <p className="text-white/90 text-sm mt-1">{summary?.reason_summary}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
          </div>
          
          <ScoreBar label="Value Proposition" scoreA={scores?.site_a?.value_proposition || 0} scoreB={scores?.site_b?.value_proposition || 0} winnerLabel={category_winners?.value_proposition} />
          <ScoreBar label="CTA Strength" scoreA={scores?.site_a?.cta_strength || 0} scoreB={scores?.site_b?.cta_strength || 0} winnerLabel={category_winners?.cta_strength} />
          <ScoreBar label="Trust Signals" scoreA={scores?.site_a?.trust_signals || 0} scoreB={scores?.site_b?.trust_signals || 0} winnerLabel={category_winners?.trust_signals} />
          <ScoreBar label="Content Depth" scoreA={scores?.site_a?.content_depth || 0} scoreB={scores?.site_b?.content_depth || 0} winnerLabel={category_winners?.content_depth} />
          <ScoreBar label="Messaging Focus" scoreA={scores?.site_a?.messaging_focus || 0} scoreB={scores?.site_b?.messaging_focus || 0} winnerLabel={category_winners?.messaging_focus} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <h5 className="font-semibold text-indigo-900">Site A Improvements</h5>
            </div>
            <ul className="space-y-2">
              {improvement_suggestions?.site_a?.map((suggestion, i) => (
                <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                  <TrendingUp className="w-3 h-3 mt-1 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <h5 className="font-semibold text-purple-900">Site B Improvements</h5>
            </div>
            <ul className="space-y-2">
              {improvement_suggestions?.site_b?.map((suggestion, i) => (
                <li key={i} className="text-sm text-purple-800 flex items-start gap-2">
                  <TrendingUp className="w-3 h-3 mt-1 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Site Analysis Card Component
const SiteCard = ({ site, label, expanded, onToggle, isWinner }) => {
  if (!site) return null;

  return (
    <div
      data-testid={`site-card-${label.toLowerCase()}`}
      className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
        isWinner ? "border-2 border-green-400 ring-2 ring-green-100" : "border-gray-200"
      }`}
    >
      <div
        className={`px-6 py-4 border-b border-gray-100 cursor-pointer ${
          label === "Website A" 
            ? "bg-gradient-to-r from-indigo-50 to-blue-50" 
            : "bg-gradient-to-r from-purple-50 to-pink-50"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center ${
              label === "Website A" ? "bg-indigo-500" : "bg-purple-500"
            }`}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                {isWinner && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Winner
                  </span>
                )}
              </div>
              <a href={site.url} target="_blank" rel="noopener noreferrer"
                className={`text-sm hover:underline flex items-center gap-1 ${label === "Website A" ? "text-indigo-600" : "text-purple-600"}`}
                onClick={(e) => e.stopPropagation()}>
                {site.url?.substring(0, 50)}{site.url?.length > 50 ? "..." : ""}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Page Info</h4>
            <div className="space-y-2">
              <div><span className="text-xs text-gray-500">Title</span><p className="text-gray-900 font-medium">{site.page_title || "Not found"}</p></div>
              <div><span className="text-xs text-gray-500">Main Heading (H1)</span><p className="text-gray-900">{site.main_heading_h1 || "Not found"}</p></div>
              <div><span className="text-xs text-gray-500">Word Count</span><p className="text-gray-900">{site.approx_word_count?.toLocaleString() || 0} words</p></div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Hero Section Summary</h4>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">{site.hero_section_summary || "No hero section detected"}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Call-to-Actions</h4>
            <div className="flex flex-wrap gap-2">
              {site.primary_cta_text && <span className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-sm font-medium">Primary: {site.primary_cta_text}</span>}
              {site.secondary_cta_text && <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm font-medium">Secondary: {site.secondary_cta_text}</span>}
              {!site.primary_cta_text && !site.secondary_cta_text && <span className="text-gray-500 text-sm">No CTAs detected</span>}
            </div>
          </div>

          {site.subheadings && site.subheadings.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Key Subheadings</h4>
              <ul className="space-y-1">
                {site.subheadings.slice(0, 6).map((heading, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="text-indigo-400 mt-1">•</span>{heading}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Trust Signals</h4>
            <div className="flex flex-wrap gap-2">
              <TrustBadge label="Testimonials" detected={site.trust_signals_detected?.testimonials} />
              <TrustBadge label="Reviews/Ratings" detected={site.trust_signals_detected?.reviews_or_ratings} />
              <TrustBadge label="Client Logos" detected={site.trust_signals_detected?.client_logos} />
              <TrustBadge label="Certifications" detected={site.trust_signals_detected?.certifications_or_badges} />
              <TrustBadge label="Social Proof" detected={site.trust_signals_detected?.social_proof_statements} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Offer Clarity</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div><span className="text-xs text-gray-500">What They Offer</span><p className="text-gray-900 text-sm">{site.offer_clarity?.what_the_business_offers || "Not clear"}</p></div>
              <div><span className="text-xs text-gray-500">Target Audience</span><p className="text-gray-900 text-sm">{site.offer_clarity?.target_audience_detected || "Not detected"}</p></div>
              <StatusBadge label="Pricing Visibility" value={site.offer_clarity?.pricing_or_plan_visibility || "missing"} goodValues={["clear"]} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Conversion Elements</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <StatusBadge label="CTA Presence" value={site.conversion_elements?.cta_presence || "weak"} goodValues={["strong"]} />
              <StatusBadge label="Lead Capture Form" value={site.conversion_elements?.lead_capture_or_form} goodValues={[true]} />
              <StatusBadge label="Contact Path" value={site.conversion_elements?.contact_or_enquiry_path || "missing"} goodValues={["clear"]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Speed Check Results Component - ENHANCED
const SpeedCheckResults = ({ result }) => {
  if (!result) return null;

  const { url, scan_data, analysis } = result;
  const score = analysis?.overview_score?.performance_score_out_of_10 || 0;
  const rating = analysis?.overview_score?.rating || "Unknown";
  const grade = analysis?.overview_score?.grade || "C";

  const getScoreColor = (score) => {
    if (score >= 8) return "from-green-500 to-emerald-600";
    if (score >= 6) return "from-blue-500 to-cyan-600";
    if (score >= 4) return "from-amber-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getGradeBadgeColor = (grade) => {
    if (grade?.startsWith('A')) return "bg-green-100 text-green-800 border-green-300";
    if (grade === 'B') return "bg-blue-100 text-blue-800 border-blue-300";
    if (grade === 'C') return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const metrics = scan_data?.basic_metrics || {};
  const indicators = scan_data?.performance_indicators || {};
  const bottlenecks = scan_data?.potential_bottlenecks || {};
  const breakdown = scan_data?.resource_breakdown || {};

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className={`bg-gradient-to-r ${getScoreColor(score)} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{score.toFixed(1)}</span>
              <span className="text-sm opacity-80">/10</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Gauge className="w-6 h-6" />
                <span className="text-xl font-semibold">Performance Score</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getGradeBadgeColor(grade)}`}>
                  {grade}
                </span>
              </div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{rating}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Analyzed URL</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline flex items-center gap-1 justify-end">
              {url?.substring(0, 40)}{url?.length > 40 ? "..." : ""}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <p className="mt-4 text-white/95 text-lg">{analysis?.analysis_summary}</p>
        {analysis?.estimated_savings && (
          <div className="mt-3 bg-white/10 rounded-lg px-4 py-2 inline-block">
            <span className="text-sm font-medium">💡 {analysis.estimated_savings}</span>
          </div>
        )}
      </div>

      {/* Timing Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Timing Metrics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={Zap} value={metrics.time_to_first_byte_ms || 0} unit="ms" label="Time to First Byte" color="blue" />
          <MetricCard icon={Activity} value={metrics.dom_content_loaded_ms || 0} unit="ms" label="DOM Content Loaded" color="indigo" />
          <MetricCard icon={Clock} value={metrics.fully_loaded_ms || 0} unit="ms" label="Fully Loaded" color="purple" />
          <MetricCard icon={Wifi} value={metrics.total_requests || 0} label="Total Requests" color="cyan" />
        </div>
      </div>

      {/* Page Size Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Page Size & Resources</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <MetricCard icon={Database} value={(metrics.total_page_size_kb / 1024).toFixed(2)} unit="MB" label="Total Page Size" color="pink" />
          <MetricCard icon={Code2} value={metrics.script_count || 0} label="Scripts" color="purple" />
          <MetricCard icon={Image} value={metrics.image_count || 0} label="Images" color="pink" />
          <MetricCard icon={FileCode} value={metrics.css_file_count || 0} label="CSS Files" color="cyan" />
          <MetricCard icon={FileCode} value={metrics.font_count || 0} label="Fonts" color="amber" />
        </div>
        
        {/* Resource Breakdown */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Resource Breakdown</span>
          </div>
          <ResourceBar breakdown={breakdown} />
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Performance Best Practices</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <PerfBadge label="Compression" enabled={indicators.compression_enabled} />
          <PerfBadge label="Cache Headers" enabled={indicators.cache_headers_present} />
          <PerfBadge label="CDN" enabled={indicators.cdn_usage_detected} />
          <PerfBadge label="HTTP/2 or HTTP/3" enabled={indicators.http2_or_http3} />
          <PerfBadge label="Mobile Viewport" enabled={indicators.mobile_viewport_tag_present} />
          <PerfBadge label="Lazy Loading" enabled={indicators.lazy_loading_present} count={indicators.lazy_loading_count} />
          <PerfBadge label="Async Scripts" enabled={indicators.async_scripts_used} />
          <PerfBadge label="Defer Scripts" enabled={indicators.defer_scripts_used} />
          <PerfBadge label="Preload Hints" enabled={indicators.preload_hints_used} />
        </div>
      </div>

      {/* Bottlenecks */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-900">Detected Issues</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <PerfBadge label={`Large Images (${bottlenecks.large_image_count || 0})`} enabled={bottlenecks.large_images_detected} goodWhenTrue={false} />
          <PerfBadge label={`Blocking Resources (${bottlenecks.render_blocking_resources || 0})`} enabled={bottlenecks.render_blocking_resources > 0} goodWhenTrue={false} />
          <PerfBadge label={`DOM Elements (${bottlenecks.dom_element_count || 0})`} enabled={bottlenecks.excessive_dom_size} goodWhenTrue={false} />
          <PerfBadge label="Too Many Requests" enabled={bottlenecks.too_many_requests} goodWhenTrue={false} />
          <PerfBadge label="Large JS Bundles" enabled={bottlenecks.large_javascript_bundles} goodWhenTrue={false} />
          <PerfBadge label={`Inline CSS (${(bottlenecks.inline_css_size_kb || 0).toFixed(1)} KB)`} enabled={bottlenecks.inline_css_detected && bottlenecks.inline_css_size_kb > 10} goodWhenTrue={false} />
        </div>
        
        {bottlenecks.third_party_domains?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Third-Party Domains ({bottlenecks.third_party_scripts || 0} requests):</p>
            <div className="flex flex-wrap gap-2">
              {bottlenecks.third_party_domains.map((domain, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{domain}</span>
              ))}
            </div>
          </div>
        )}

        {bottlenecks.unoptimized_images?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Images that could be optimized (use WebP/AVIF):</p>
            <ul className="space-y-1">
              {bottlenecks.unoptimized_images.slice(0, 3).map((img, i) => (
                <li key={i} className="text-xs text-gray-600 truncate">• {img}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Findings & Issues */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Performance Highlights</h3>
          </div>
          <ul className="space-y-2">
            {analysis?.performance_highlights?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
            {(!analysis?.performance_highlights || analysis.performance_highlights.length === 0) && (
              <li className="text-sm text-gray-500">No specific highlights detected</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Critical Issues</h3>
          </div>
          <ul className="space-y-2">
            {analysis?.critical_issues?.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                {issue}
              </li>
            ))}
            {(!analysis?.critical_issues || analysis.critical_issues.length === 0) && (
              <li className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                No critical issues found!
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Improvement Recommendations - Developer Guide */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-bold text-white text-lg">Developer&apos;s Speed Optimization Guide</h3>
              <p className="text-green-100 text-sm">Step-by-step fixes you can implement without plugins</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Critical Fixes */}
          {analysis?.improvement_recommendations?.critical?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900">Critical Fixes</h4>
                  <p className="text-xs text-red-600">Fix these first for maximum impact</p>
                </div>
              </div>
              <div className="space-y-4">
                {analysis.improvement_recommendations.critical.map((fix, i) => (
                  <DetailedFixCard key={i} fix={fix} priority="critical" index={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* High Impact Fixes */}
          {analysis?.improvement_recommendations?.high_impact?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">High Impact Optimizations</h4>
                  <p className="text-xs text-amber-600">Significant improvements with moderate effort</p>
                </div>
              </div>
              <div className="space-y-4">
                {analysis.improvement_recommendations.high_impact.map((fix, i) => (
                  <DetailedFixCard key={i} fix={fix} priority="high" index={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* Medium Impact Fixes */}
          {analysis?.improvement_recommendations?.medium_impact?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Medium Impact Optimizations</h4>
                  <p className="text-xs text-blue-600">Good improvements for polishing performance</p>
                </div>
              </div>
              <div className="space-y-4">
                {analysis.improvement_recommendations.medium_impact.map((fix, i) => (
                  <DetailedFixCard key={i} fix={fix} priority="medium" index={i + 1} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins */}
          {analysis?.improvement_recommendations?.quick_wins?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900">Quick Wins</h4>
                  <p className="text-xs text-green-600">Easy fixes you can do in minutes</p>
                </div>
              </div>
              <div className="space-y-4">
                {analysis.improvement_recommendations.quick_wins.map((fix, i) => (
                  <DetailedFixCard key={i} fix={fix} priority="quick" index={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Checklist Item Component
const ChecklistItemCard = ({ item, colorClass }) => {
  const statusConfig = {
    passed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    missing: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" }
  };
  
  const config = statusConfig[item.status] || statusConfig.missing;
  const IconComponent = config.icon;
  
  return (
    <div className={`${config.bg} border rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <IconComponent className={`w-4 h-4 ${config.color} mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{item.item}</p>
          {item.recommendation && (
            <p className="text-xs text-gray-600 mt-1">{item.recommendation}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Score Gauge Component
const ScoreGauge = ({ score, label, size = "normal" }) => {
  const getColor = (s) => {
    if (s >= 80) return "text-green-600";
    if (s >= 60) return "text-blue-600";
    if (s >= 40) return "text-amber-600";
    return "text-red-600";
  };
  
  const getBgColor = (s) => {
    if (s >= 80) return "bg-green-500";
    if (s >= 60) return "bg-blue-500";
    if (s >= 40) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="text-center">
      <div className={`${size === "large" ? "w-20 h-20" : "w-14 h-14"} rounded-full bg-gray-100 flex items-center justify-center mx-auto relative`}>
        <div 
          className={`absolute inset-1 rounded-full ${getBgColor(score)}`}
          style={{
            background: `conic-gradient(${score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'} ${score * 3.6}deg, #e5e7eb ${score * 3.6}deg)`
          }}
        />
        <div className={`${size === "large" ? "w-16 h-16" : "w-10 h-10"} rounded-full bg-white flex items-center justify-center z-10`}>
          <span className={`${size === "large" ? "text-xl" : "text-sm"} font-bold ${getColor(score)}`}>{score}</span>
        </div>
      </div>
      <p className={`${size === "large" ? "text-sm" : "text-xs"} text-gray-600 mt-2`}>{label}</p>
    </div>
  );
};

// Rewrite Suggestion Card
const RewriteSuggestionCard = ({ suggestion, index, type }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const typeConfig = {
    headline: { icon: Type, color: "border-purple-200 bg-purple-50" },
    hero: { icon: Sparkles, color: "border-indigo-200 bg-indigo-50" },
    cta: { icon: Target, color: "border-green-200 bg-green-50" },
    content: { icon: PenTool, color: "border-blue-200 bg-blue-50" }
  };
  
  const config = typeConfig[type] || typeConfig.content;
  const IconComponent = config.icon;
  
  return (
    <div className={`${config.color} border rounded-lg p-3`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0">
            {index}
          </div>
          <p className="text-sm text-gray-800">{suggestion}</p>
        </div>
        <button 
          onClick={handleCopy} 
          className="p-1 hover:bg-white/50 rounded transition-colors flex-shrink-0"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
        </button>
      </div>
    </div>
  );
};

// Page Assessment Results Component
const PageAssessmentResults = ({ result }) => {
  const [activeSection, setActiveSection] = useState("overview");
  
  if (!result) return null;

  const { 
    url, business_type, goal, overall_score, grade,
    uiux_scores, headline_analysis, cta_analysis, hero_analysis, trust_analysis,
    content_analysis, checklists, top_priorities, quick_wins
  } = result;

  const getGradeColor = (g) => {
    if (g?.startsWith('A')) return "from-green-500 to-emerald-600";
    if (g === 'B') return "from-blue-500 to-cyan-600";
    if (g === 'C') return "from-amber-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getGradeBadgeColor = (g) => {
    if (g?.startsWith('A')) return "bg-green-100 text-green-800 border-green-300";
    if (g === 'B') return "bg-blue-100 text-blue-800 border-blue-300";
    if (g === 'C') return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const businessTypeLabels = {
    saas: "SaaS",
    ecommerce: "E-commerce",
    agency: "Agency",
    portfolio: "Portfolio",
    blog: "Blog",
    local_business: "Local Business",
    nonprofit: "Non-profit"
  };

  const goalLabels = {
    leads: "Lead Generation",
    sales: "Sales/Conversion",
    branding: "Brand Building"
  };

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className={`bg-gradient-to-r ${getGradeColor(grade)} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{overall_score}</span>
              <span className="text-sm opacity-80">/100</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6" />
                <span className="text-xl font-semibold">Page Assessment Score</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getGradeBadgeColor(grade)}`}>
                  {grade}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <span className="bg-white/20 px-2 py-1 rounded">{businessTypeLabels[business_type] || business_type}</span>
                <span className="bg-white/20 px-2 py-1 rounded">{goalLabels[goal] || goal}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Analyzed URL</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline flex items-center gap-1 justify-end text-sm">
              {url?.substring(0, 40)}{url?.length > 40 ? "..." : ""}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "uiux", label: "UI/UX Analysis", icon: Layout },
            { id: "content", label: "Content Analysis", icon: BookOpen },
            { id: "checklists", label: "Checklists", icon: ListChecks },
            { id: "rewrites", label: "Rewrites", icon: PenTool }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === tab.id 
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50/50" 
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Top Priorities & Quick Wins */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Top Priorities</h4>
                  </div>
                  <ul className="space-y-2">
                    {top_priorities?.map((priority, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                        <span className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-xs font-bold text-red-800 flex-shrink-0">{i + 1}</span>
                        {priority}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Quick Wins</h4>
                  </div>
                  <ul className="space-y-2">
                    {quick_wins?.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                        <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* UI/UX Score Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-600" />
                  UI/UX Scores Overview
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <ScoreGauge score={uiux_scores?.headline_strength || 0} label="Headline" />
                  <ScoreGauge score={uiux_scores?.cta_effectiveness || 0} label="CTA" />
                  <ScoreGauge score={uiux_scores?.above_fold_content || 0} label="Above Fold" />
                  <ScoreGauge score={uiux_scores?.trust_signals || 0} label="Trust" />
                  <ScoreGauge score={uiux_scores?.visual_hierarchy || 0} label="Hierarchy" />
                  <ScoreGauge score={uiux_scores?.overall_score || 0} label="Overall" size="large" />
                </div>
              </div>

              {/* Content Score Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Content Scores Overview
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                  <ScoreGauge score={content_analysis?.scores?.readability_score || 0} label="Readability" />
                  <ScoreGauge score={content_analysis?.scores?.keyword_density_score || 0} label="Keywords" />
                  <ScoreGauge score={content_analysis?.scores?.paragraph_structure_score || 0} label="Structure" />
                  <ScoreGauge score={content_analysis?.scores?.tone_clarity_score || 0} label="Tone" />
                  <ScoreGauge score={content_analysis?.scores?.skimmability_score || 0} label="Skimmability" />
                  <ScoreGauge score={content_analysis?.scores?.jargon_score || 0} label="Jargon-Free" />
                  <ScoreGauge score={content_analysis?.scores?.overall_score || 0} label="Overall" size="large" />
                </div>
              </div>

              {/* Page Summary */}
              {content_analysis?.bullet_point_summary?.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Page Summary</h4>
                  </div>
                  <ul className="space-y-2">
                    {content_analysis.bullet_point_summary.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="text-blue-600 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* UI/UX Analysis Section */}
          {activeSection === "uiux" && (
            <div className="space-y-6">
              {/* Headline Analysis */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Type className="w-5 h-5 text-purple-600" />
                    Headline Analysis
                  </h4>
                  <ScoreGauge score={headline_analysis?.strength_score || 0} label="Score" />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Current Headline</p>
                  <p className="font-medium text-gray-900">{headline_analysis?.current_headline || "Not found"}</p>
                </div>
                {headline_analysis?.issues?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Issues</p>
                    <ul className="space-y-1">
                      {headline_analysis.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA Analysis */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    CTA Analysis
                  </h4>
                  <ScoreGauge score={cta_analysis?.placement_score || 0} label="Placement" />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">CTA Found</p>
                    <p className={`font-medium ${cta_analysis?.cta_found ? "text-green-700" : "text-red-700"}`}>
                      {cta_analysis?.cta_found ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Current CTA Text</p>
                    <p className="font-medium text-gray-900">{cta_analysis?.cta_text || "N/A"}</p>
                  </div>
                </div>
                {cta_analysis?.issues?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Issues</p>
                    <ul className="space-y-1">
                      {cta_analysis.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cta_analysis?.suggested_placements?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Suggested Placements</p>
                    <ul className="space-y-1">
                      {cta_analysis.suggested_placements.map((placement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {placement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Hero Section Analysis */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Hero Section Analysis
                  </h4>
                  <ScoreGauge score={hero_analysis?.effectiveness_score || 0} label="Effectiveness" />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Current Summary</p>
                  <p className="text-sm text-gray-700">{hero_analysis?.current_summary || "Not analyzed"}</p>
                </div>
                {hero_analysis?.issues?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Issues</p>
                    <ul className="space-y-1">
                      {hero_analysis.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Trust Signals Analysis */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-600" />
                    Trust Signals Analysis
                  </h4>
                  <ScoreGauge score={trust_analysis?.score || 0} label="Trust Score" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-2">Detected Signals</p>
                    {trust_analysis?.detected_signals?.length > 0 ? (
                      <ul className="space-y-1">
                        {trust_analysis.detected_signals.map((signal, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {signal}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No trust signals detected</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-2">Missing Signals</p>
                    {trust_analysis?.missing_signals?.length > 0 ? (
                      <ul className="space-y-1">
                        {trust_analysis.missing_signals.map((signal, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {signal}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-green-600">All expected signals present</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Analysis Section */}
          {activeSection === "content" && (
            <div className="space-y-6">
              {/* Tone Analysis */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Tone Analysis</h4>
                </div>
                <p className="text-sm text-blue-800">{content_analysis?.tone_analysis || "No tone analysis available"}</p>
              </div>

              {/* Readability Issues */}
              {content_analysis?.readability_issues?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Readability Issues
                  </h4>
                  <ul className="space-y-2">
                    {content_analysis.readability_issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Jargon Detected */}
              {content_analysis?.jargon_detected?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-red-600" />
                    Jargon Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {content_analysis.jargon_detected.map((term, i) => (
                      <span key={i} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full border border-red-200">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Meta Description */}
              {content_analysis?.suggested_meta_description && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Suggested Meta Description</h4>
                    </div>
                    <span className="text-xs text-green-600">{content_analysis.suggested_meta_description.length}/155 chars</span>
                  </div>
                  <p className="text-sm text-green-800 bg-white/60 rounded-lg p-3">{content_analysis.suggested_meta_description}</p>
                </div>
              )}
            </div>
          )}

          {/* Checklists Section */}
          {activeSection === "checklists" && (
            <div className="space-y-6">
              {/* UX Checklist */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-purple-600" />
                  UX Checklist
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {checklists?.ux_checklist?.map((item, i) => (
                    <ChecklistItemCard key={i} item={item} />
                  ))}
                </div>
              </div>

              {/* Conversion Checklist */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Conversion Checklist
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {checklists?.conversion_checklist?.map((item, i) => (
                    <ChecklistItemCard key={i} item={item} />
                  ))}
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  SEO Basics Checklist
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {checklists?.seo_checklist?.map((item, i) => (
                    <ChecklistItemCard key={i} item={item} />
                  ))}
                </div>
              </div>

              {/* Content Improvement Plan */}
              {checklists?.content_improvement_plan?.length > 0 && (
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                  <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-indigo-600" />
                    Content Improvement Plan
                  </h4>
                  <ol className="space-y-3">
                    {checklists.content_improvement_plan.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-indigo-800">
                        <span className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-800 flex-shrink-0">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Rewrites Section */}
          {activeSection === "rewrites" && (
            <div className="space-y-6">
              {/* Headline Rewrites */}
              {headline_analysis?.rewrite_suggestions?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-purple-600" />
                    Headline Rewrite Suggestions
                  </h4>
                  <div className="space-y-3">
                    {headline_analysis.rewrite_suggestions.map((suggestion, i) => (
                      <RewriteSuggestionCard key={i} suggestion={suggestion} index={i + 1} type="headline" />
                    ))}
                  </div>
                </div>
              )}

              {/* Hero Rewrites */}
              {hero_analysis?.rewrite_suggestions?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Hero Section Rewrite Suggestions
                  </h4>
                  <div className="space-y-3">
                    {hero_analysis.rewrite_suggestions.map((suggestion, i) => (
                      <RewriteSuggestionCard key={i} suggestion={suggestion} index={i + 1} type="hero" />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Copy Improvements */}
              {cta_analysis?.copy_improvements?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    CTA Copy Improvements
                  </h4>
                  <div className="space-y-3">
                    {cta_analysis.copy_improvements.map((suggestion, i) => (
                      <RewriteSuggestionCard key={i} suggestion={suggestion} index={i + 1} type="cta" />
                    ))}
                  </div>
                </div>
              )}

              {/* Content Rewrites */}
              {content_analysis?.rewrite_suggestions?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-blue-600" />
                    Content Rewrite Suggestions
                  </h4>
                  <div className="space-y-3">
                    {content_analysis.rewrite_suggestions.map((suggestion, i) => (
                      <RewriteSuggestionCard key={i} suggestion={suggestion} index={i + 1} type="content" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Heatmap Overlay Component
const HeatmapOverlay = ({ zones, type, color, opacity }) => {
  // Determine border and text colors based on zone type
  const getZoneStyles = (zoneType) => {
    switch(zoneType) {
      case 'high':
        return {
          borderColor: 'rgba(220, 38, 38, 0.9)',
          textBg: 'bg-red-600',
          shadow: '0 0 8px rgba(220, 38, 38, 0.5)'
        };
      case 'medium':
        return {
          borderColor: 'rgba(217, 119, 6, 0.9)',
          textBg: 'bg-amber-600',
          shadow: '0 0 8px rgba(217, 119, 6, 0.4)'
        };
      case 'low':
        return {
          borderColor: 'rgba(37, 99, 235, 0.8)',
          textBg: 'bg-blue-600',
          shadow: '0 0 6px rgba(37, 99, 235, 0.3)'
        };
      default:
        return {
          borderColor: 'rgba(100, 100, 100, 0.8)',
          textBg: 'bg-gray-600',
          shadow: 'none'
        };
    }
  };

  const styles = getZoneStyles(type);

  return (
    <>
      {zones?.map((zone, i) => (
        <div
          key={`${type}-${i}`}
          className="absolute transition-all duration-200 cursor-pointer group"
          style={{
            left: `${zone.x_percent}%`,
            top: `${zone.y_percent}%`,
            width: `${zone.width_percent}%`,
            height: `${zone.height_percent}%`,
            backgroundColor: color,
            border: `2px solid ${styles.borderColor}`,
            borderRadius: '4px',
            boxShadow: styles.shadow,
          }}
          title={`${zone.zone_name}: ${zone.reasoning}`}
        >
          {/* Zone label - appears on hover or for larger zones */}
          <div 
            className={`absolute -top-6 left-0 ${styles.textBg} text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10`}
          >
            {zone.zone_name} ({zone.attention_score}/10)
          </div>
          {/* Score badge - always visible for zones large enough */}
          {(zone.width_percent > 8 && zone.height_percent > 3) && (
            <span className={`absolute top-1 right-1 ${styles.textBg} text-white text-[9px] font-bold px-1 py-0.5 rounded shadow`}>
              {zone.attention_score}
            </span>
          )}
        </div>
      ))}
    </>
  );
};

// Attention Zone Card
const AttentionZoneCard = ({ zone, colorClass }) => (
  <div className={`${colorClass} rounded-lg p-3 border`}>
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span className="font-semibold text-sm">{zone.zone_name}</span>
        </div>
        <p className="text-xs mt-1 opacity-80">{zone.description}</p>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold">{zone.attention_score}</div>
        <div className="text-xs opacity-70">/10</div>
      </div>
    </div>
    <p className="text-xs mt-2 italic opacity-70">{zone.reasoning}</p>
  </div>
);

// Layout Element Badge
const LayoutElementBadge = ({ element }) => {
  const typeColors = {
    headline: "bg-purple-100 text-purple-800 border-purple-200",
    cta: "bg-green-100 text-green-800 border-green-200",
    image: "bg-pink-100 text-pink-800 border-pink-200",
    navigation: "bg-blue-100 text-blue-800 border-blue-200",
    form: "bg-amber-100 text-amber-800 border-amber-200",
    footer: "bg-gray-100 text-gray-800 border-gray-200",
    hero: "bg-indigo-100 text-indigo-800 border-indigo-200",
    testimonial: "bg-cyan-100 text-cyan-800 border-cyan-200",
  };
  
  const color = typeColors[element.element_type] || "bg-gray-100 text-gray-800 border-gray-200";
  const impactIcon = element.attention_impact === "high" ? "🔥" : element.attention_impact === "medium" ? "👀" : "👁";
  
  return (
    <div className={`${color} border rounded-lg p-2 text-xs`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold capitalize">{element.element_type}</span>
        <span>{impactIcon}</span>
      </div>
      <p className="truncate opacity-70 mt-1">{element.content_preview}</p>
      <div className="flex items-center gap-1 mt-1 opacity-60">
        <MapPin className="w-3 h-3" />
        <span className="capitalize">{element.position}</span>
      </div>
    </div>
  );
};

// Heatmap Results Component
const HeatmapResults = ({ result }) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeZoneType, setActiveZoneType] = useState("all"); // "all", "high", "medium", "low"

  if (!result) return null;

  const { url, screenshot_base64, analysis } = result;

  const patternColors = {
    "F-pattern": "from-blue-500 to-cyan-500",
    "Z-pattern": "from-purple-500 to-pink-500",
    "Gutenberg": "from-amber-500 to-orange-500",
    "Spotted": "from-green-500 to-emerald-500",
    "Custom": "from-gray-500 to-slate-500"
  };

  const effectivenessColors = {
    excellent: "bg-green-500",
    good: "bg-blue-500",
    needs_improvement: "bg-amber-500",
    poor: "bg-red-500"
  };

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className={`bg-gradient-to-r ${patternColors[analysis?.visual_pattern?.pattern_type] || "from-indigo-500 to-purple-600"} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex flex-col items-center justify-center">
              <Eye className="w-8 h-8 mb-1" />
              <span className="text-2xl font-bold">{analysis?.overall_attention_score || 0}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl font-semibold">Attention Analysis</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${effectivenessColors[analysis?.layout_effectiveness] || 'bg-gray-500'}`}>
                  {analysis?.layout_effectiveness?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span className="font-medium">{analysis?.visual_pattern?.pattern_type || 'Custom'} Layout</span>
              </div>
              <p className="text-white/80 text-sm mt-1">{analysis?.visual_pattern?.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Analyzed URL</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline flex items-center gap-1 justify-end text-sm">
              {url?.substring(0, 40)}{url?.length > 40 ? "..." : ""}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Screenshot with Heatmap Overlay */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Visual Attention Heatmap</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveZoneType("all")}
                className={`px-2 py-1 rounded ${activeZoneType === "all" ? "bg-white shadow-sm" : ""}`}
              >All</button>
              <button
                onClick={() => setActiveZoneType("high")}
                className={`px-2 py-1 rounded ${activeZoneType === "high" ? "bg-white shadow-sm text-red-600" : ""}`}
              >High</button>
              <button
                onClick={() => setActiveZoneType("medium")}
                className={`px-2 py-1 rounded ${activeZoneType === "medium" ? "bg-white shadow-sm text-amber-600" : ""}`}
              >Medium</button>
              <button
                onClick={() => setActiveZoneType("low")}
                className={`px-2 py-1 rounded ${activeZoneType === "low" ? "bg-white shadow-sm text-blue-600" : ""}`}
              >Low</button>
            </div>
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border ${showOverlay ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-gray-50 border-gray-200 text-gray-600"}`}
            >
              <Eye className="w-4 h-4" />
              {showOverlay ? "Hide" : "Show"} Overlay
            </button>
          </div>
        </div>
        
        <div className="relative">
          {screenshot_base64 && (
            <img
              src={`data:image/jpeg;base64,${screenshot_base64}`}
              alt="Website Screenshot"
              className="w-full h-auto"
            />
          )}
          
          {/* Heatmap Overlays */}
          {showOverlay && (
            <div className="absolute inset-0">
              {(activeZoneType === "all" || activeZoneType === "high") && (
                <HeatmapOverlay 
                  zones={analysis?.high_attention_zones} 
                  type="high" 
                  color="rgba(239, 68, 68, 0.35)" 
                  opacity={0.6}
                />
              )}
              {(activeZoneType === "all" || activeZoneType === "medium") && (
                <HeatmapOverlay 
                  zones={analysis?.medium_attention_zones} 
                  type="medium" 
                  color="rgba(245, 158, 11, 0.3)" 
                  opacity={0.5}
                />
              )}
              {(activeZoneType === "all" || activeZoneType === "low") && (
                <HeatmapOverlay 
                  zones={analysis?.low_attention_zones} 
                  type="low" 
                  color="rgba(59, 130, 246, 0.25)" 
                  opacity={0.4}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/50 border border-red-500" />
            <span>High Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500/40 border border-amber-500" />
            <span>Medium Attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500" />
            <span>Low Attention</span>
          </div>
        </div>
      </div>

      {/* Attention Zones */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* High Attention */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <Focus className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-900">High Attention Zones</h4>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {analysis?.high_attention_zones?.map((zone, i) => (
              <AttentionZoneCard key={i} zone={zone} colorClass="bg-red-50 border-red-200 text-red-900" />
            ))}
            {(!analysis?.high_attention_zones || analysis.high_attention_zones.length === 0) && (
              <p className="text-sm text-gray-500">No high attention zones detected</p>
            )}
          </div>
        </div>

        {/* Medium Attention */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-amber-600" />
            <h4 className="font-semibold text-amber-900">Medium Attention Zones</h4>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {analysis?.medium_attention_zones?.map((zone, i) => (
              <AttentionZoneCard key={i} zone={zone} colorClass="bg-amber-50 border-amber-200 text-amber-900" />
            ))}
            {(!analysis?.medium_attention_zones || analysis.medium_attention_zones.length === 0) && (
              <p className="text-sm text-gray-500">No medium attention zones detected</p>
            )}
          </div>
        </div>

        {/* Low Attention */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Low Attention Zones</h4>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {analysis?.low_attention_zones?.map((zone, i) => (
              <AttentionZoneCard key={i} zone={zone} colorClass="bg-blue-50 border-blue-200 text-blue-900" />
            ))}
            {(!analysis?.low_attention_zones || analysis.low_attention_zones.length === 0) && (
              <p className="text-sm text-gray-500">No low attention zones detected</p>
            )}
          </div>
        </div>
      </div>

      {/* Layout Elements */}
      {analysis?.layout_elements?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Detected Layout Elements</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {analysis.layout_elements.map((element, i) => (
              <LayoutElementBadge key={i} element={element} />
            ))}
          </div>
        </div>
      )}

      {/* Key Findings & Suggestions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Key Findings</h3>
          </div>
          <ul className="space-y-2">
            {analysis?.key_findings?.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {analysis?.improvement_suggestions?.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conversion Optimization Tips */}
      {analysis?.conversion_optimization_tips?.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Conversion Optimization Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.conversion_optimization_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/60 rounded-lg p-3">
                <Rocket className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-800">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Pattern Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Visual Pattern Analysis</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 mb-1">Pattern Type</div>
            <div className="text-xl font-bold text-purple-900">{analysis?.visual_pattern?.pattern_type || 'Not Detected'}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 mb-1">Effectiveness Score</div>
            <div className="text-xl font-bold text-purple-900">{analysis?.visual_pattern?.effectiveness_score || 0}/10</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 md:col-span-1">
            <div className="text-sm text-purple-600 mb-1">Recommendation</div>
            <div className="text-sm text-purple-800">{analysis?.visual_pattern?.recommendation || 'No specific recommendation'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [mainTab, setMainTab] = useState("compare");
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [expandedA, setExpandedA] = useState(true);
  const [expandedB, setExpandedB] = useState(true);
  const [activeTab, setActiveTab] = useState("comparison");
  const [speedUrl, setSpeedUrl] = useState("");
  const [speedLoading, setSpeedLoading] = useState(false);
  const [speedError, setSpeedError] = useState("");
  const [speedResult, setSpeedResult] = useState(null);
  const [speedCopied, setSpeedCopied] = useState(false);
  
  // Heatmap state
  const [heatmapUrl, setHeatmapUrl] = useState("");
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [heatmapError, setHeatmapError] = useState("");
  const [heatmapResult, setHeatmapResult] = useState(null);

  // Page Assessment state
  const [assessmentUrl, setAssessmentUrl] = useState("");
  const [assessmentBusinessType, setAssessmentBusinessType] = useState("saas");
  const [assessmentGoal, setAssessmentGoal] = useState("leads");
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState("");
  const [assessmentResult, setAssessmentResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!urlA.trim() || !urlB.trim()) { setError("Please enter both website URLs"); return; }
    const formatUrl = (url) => (!url.startsWith("http://") && !url.startsWith("https://")) ? "https://" + url : url;
    setLoading(true);
    try {
      const response = await axios.post(`${API}/analyze-and-compare`, { url_a: formatUrl(urlA.trim()), url_b: formatUrl(urlB.trim()) });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to analyze websites. Please check the URLs and try again.");
    } finally { setLoading(false); }
  };

  const handleSpeedCheck = async (e) => {
    e.preventDefault();
    setSpeedError("");
    setSpeedResult(null);
    if (!speedUrl.trim()) { setSpeedError("Please enter a website URL"); return; }
    setSpeedLoading(true);
    try {
      const response = await axios.post(`${API}/check-speed`, { url: speedUrl.trim() });
      setSpeedResult(response.data);
    } catch (err) {
      setSpeedError(err.response?.data?.detail || "Failed to check website speed. Please check the URL and try again.");
    } finally { setSpeedLoading(false); }
  };

  const handleHeatmapAnalyze = async (e) => {
    e.preventDefault();
    setHeatmapError("");
    setHeatmapResult(null);
    if (!heatmapUrl.trim()) { setHeatmapError("Please enter a website URL"); return; }
    setHeatmapLoading(true);
    try {
      const response = await axios.post(`${API}/analyze-heatmap`, { url: heatmapUrl.trim() });
      setHeatmapResult(response.data);
    } catch (err) {
      setHeatmapError(err.response?.data?.detail || "Failed to analyze website. Please check the URL and try again.");
    } finally { setHeatmapLoading(false); }
  };

  const handleAssessmentAnalyze = async (e) => {
    e.preventDefault();
    setAssessmentError("");
    setAssessmentResult(null);
    if (!assessmentUrl.trim()) { setAssessmentError("Please enter a website URL"); return; }
    setAssessmentLoading(true);
    try {
      const response = await axios.post(`${API}/page-assessment`, { 
        url: assessmentUrl.trim(),
        business_type: assessmentBusinessType,
        goal: assessmentGoal
      });
      setAssessmentResult(response.data);
    } catch (err) {
      setAssessmentError(err.response?.data?.detail || "Failed to assess page. Please check the URL and try again.");
    } finally { setAssessmentLoading(false); }
  };

  const handleCopyJson = () => { if (result) { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  const handleSpeedCopyJson = () => { if (speedResult) { navigator.clipboard.writeText(JSON.stringify(speedResult, null, 2)); setSpeedCopied(true); setTimeout(() => setSpeedCopied(false), 2000); } };

  const winner = result?.comparison?.summary?.overall_winner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Website Analyzer</h1>
                <p className="text-sm text-gray-500">AI-powered analysis & performance</p>
              </div>
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-wrap">
              <button onClick={() => setMainTab("compare")} data-testid="tab-compare"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mainTab === "compare" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                <Globe className="w-4 h-4" />Compare Sites
              </button>
              <button onClick={() => setMainTab("speed")} data-testid="tab-speed"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mainTab === "speed" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                <Zap className="w-4 h-4" />Check Speed
              </button>
              <button onClick={() => setMainTab("heatmap")} data-testid="tab-heatmap"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mainTab === "heatmap" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                <Eye className="w-4 h-4" />AI Heatmap
              </button>
              <button onClick={() => setMainTab("assessment")} data-testid="tab-assessment"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mainTab === "assessment" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                <FileText className="w-4 h-4" />Page Assessment
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {mainTab === "compare" && (
          <>
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="url-a" className="block text-sm font-medium text-gray-700 mb-1.5">Website A URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                      <input id="url-a" data-testid="input-url-a" type="text" value={urlA} onChange={(e) => setUrlA(e.target.value)} placeholder="https://example.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="url-b" className="block text-sm font-medium text-gray-700 mb-1.5">Website B URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input id="url-b" data-testid="input-url-b" type="text" value={urlB} onChange={(e) => setUrlB(e.target.value)} placeholder="https://competitor.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white" />
                    </div>
                  </div>
                </div>
                {error && <div data-testid="error-message" className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">{error}</span></div>}
                <button type="submit" data-testid="analyze-button" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Analyzing...</> : <><Search className="w-5 h-5" />Analyze & Compare</>}
                </button>
              </form>
            </div>

            {loading && <div className="text-center py-16"><div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /><div className="text-left"><p className="font-medium text-gray-900">Analyzing websites...</p><p className="text-sm text-gray-500">Fetching content, extracting data & generating comparison</p></div></div></div>}

            {result && !loading && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab("comparison")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "comparison" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}><Trophy className="w-4 h-4 inline mr-1.5" />Comparison</button>
                    <button onClick={() => setActiveTab("details")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "details" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}><Globe className="w-4 h-4 inline mr-1.5" />Site Details</button>
                    <button onClick={() => setActiveTab("json")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "json" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>{"{ }"} JSON</button>
                  </div>
                  <button onClick={handleCopyJson} data-testid="copy-json-button" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    {copied ? <><Check className="w-4 h-4 text-green-600" />Copied!</> : <><Copy className="w-4 h-4" />Copy JSON</>}
                  </button>
                </div>
                {activeTab === "comparison" && result.comparison && <ComparisonCard comparison={result.comparison} />}
                {activeTab === "details" && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <SiteCard site={result.site_a} label="Website A" expanded={expandedA} onToggle={() => setExpandedA(!expandedA)} isWinner={winner === "Site A"} />
                    <SiteCard site={result.site_b} label="Website B" expanded={expandedB} onToggle={() => setExpandedB(!expandedB)} isWinner={winner === "Site B"} />
                  </div>
                )}
                {activeTab === "json" && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Raw JSON Output</h3></div>
                    <pre data-testid="json-output" className="p-6 text-sm text-gray-700 overflow-x-auto bg-gray-50 max-h-[600px]">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Globe className="w-10 h-10 text-indigo-600" /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to analyze</h3>
                <p className="text-gray-500 max-w-md mx-auto">Enter two website URLs above to extract, compare, and get AI-powered insights on their marketing effectiveness.</p>
              </div>
            )}
          </>
        )}

        {mainTab === "speed" && (
          <>
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8">
              <form onSubmit={handleSpeedCheck} className="space-y-4">
                <div>
                  <label htmlFor="speed-url" className="block text-sm font-medium text-gray-700 mb-1.5">Website URL to Check</label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                    <input id="speed-url" data-testid="input-speed-url" type="text" value={speedUrl} onChange={(e) => setSpeedUrl(e.target.value)} placeholder="https://example.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                </div>
                {speedError && <div data-testid="speed-error-message" className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">{speedError}</span></div>}
                <button type="submit" data-testid="speed-check-button" disabled={speedLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-200">
                  {speedLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Analyzing performance (this may take ~30s)...</> : <><Gauge className="w-5 h-5" />Check Speed</>}
                </button>
              </form>
            </div>

            {speedLoading && <div className="text-center py-16"><div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100"><Loader2 className="w-6 h-6 animate-spin text-amber-600" /><div className="text-left"><p className="font-medium text-gray-900">Analyzing website performance...</p><p className="text-sm text-gray-500">Loading page in browser, measuring metrics & generating insights</p></div></div></div>}

            {speedResult && !speedLoading && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button onClick={handleSpeedCopyJson} data-testid="speed-copy-json-button" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    {speedCopied ? <><Check className="w-4 h-4 text-green-600" />Copied!</> : <><Copy className="w-4 h-4" />Copy JSON</>}
                  </button>
                </div>
                <SpeedCheckResults result={speedResult} />
              </div>
            )}

            {!speedResult && !speedLoading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Gauge className="w-10 h-10 text-amber-600" /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to check speed</h3>
                <p className="text-gray-500 max-w-md mx-auto">Enter a website URL above to analyze its performance with real browser rendering, detect bottlenecks, and get expert optimization recommendations.</p>
              </div>
            )}
          </>
        )}

        {/* AI Heatmap Tab */}
        {mainTab === "heatmap" && (
          <>
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  AI-Predicted Attention Heatmap
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Analyze visual hierarchy, attention zones, and conversion optimization opportunities using AI vision analysis.
                </p>
              </div>
              <form onSubmit={handleHeatmapAnalyze} className="space-y-4">
                <div>
                  <label htmlFor="heatmap-url" className="block text-sm font-medium text-gray-700 mb-1.5">Website URL to Analyze</label>
                  <div className="relative">
                    <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                    <input id="heatmap-url" data-testid="input-heatmap-url" type="text" value={heatmapUrl} onChange={(e) => setHeatmapUrl(e.target.value)} placeholder="https://example.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                </div>
                {heatmapError && <div data-testid="heatmap-error-message" className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">{heatmapError}</span></div>}
                <button type="submit" data-testid="heatmap-analyze-button" disabled={heatmapLoading} className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-200">
                  {heatmapLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Analyzing visual attention (~30s)...</> : <><Eye className="w-5 h-5" />Generate Attention Heatmap</>}
                </button>
              </form>
            </div>

            {heatmapLoading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Analyzing visual attention...</p>
                    <p className="text-sm text-gray-500">Capturing screenshot & predicting attention zones with AI</p>
                  </div>
                </div>
              </div>
            )}

            {heatmapResult && !heatmapLoading && <HeatmapResults result={heatmapResult} />}

            {!heatmapResult && !heatmapLoading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to analyze attention</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter a website URL to generate an AI-predicted attention heatmap based on visual hierarchy, layout patterns, and UX best practices.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-xs text-gray-500">
                  <div className="bg-white rounded-lg p-3 border">
                    <Focus className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p>High Attention Zones</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <Target className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p>Visual Patterns</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <Layout className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p>Layout Analysis</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Page Assessment Tab */}
        {mainTab === "assessment" && (
          <>
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Comprehensive Page Assessment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Get actionable UI/UX suggestions, content analysis, and personalized checklists tailored to your business and goals.
                </p>
              </div>
              <form onSubmit={handleAssessmentAnalyze} className="space-y-4">
                <div>
                  <label htmlFor="assessment-url" className="block text-sm font-medium text-gray-700 mb-1.5">Website URL to Assess</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                    <input 
                      id="assessment-url" 
                      data-testid="input-assessment-url" 
                      type="text" 
                      value={assessmentUrl} 
                      onChange={(e) => setAssessmentUrl(e.target.value)} 
                      placeholder="https://yourwebsite.com" 
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 mb-1.5">Business Type</label>
                    <select
                      id="business-type"
                      data-testid="select-business-type"
                      value={assessmentBusinessType}
                      onChange={(e) => setAssessmentBusinessType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="saas">SaaS (Software as a Service)</option>
                      <option value="ecommerce">E-commerce / Online Store</option>
                      <option value="agency">Agency / Service Business</option>
                      <option value="portfolio">Portfolio / Personal Brand</option>
                      <option value="blog">Blog / Content Site</option>
                      <option value="local_business">Local Business</option>
                      <option value="nonprofit">Non-profit Organization</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1.5">Primary Goal</label>
                    <select
                      id="goal"
                      data-testid="select-goal"
                      value={assessmentGoal}
                      onChange={(e) => setAssessmentGoal(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="leads">Lead Generation (Forms, Demos, Sign-ups)</option>
                      <option value="sales">Sales / Conversions (Purchases, Subscriptions)</option>
                      <option value="branding">Brand Building (Awareness, Authority)</option>
                    </select>
                  </div>
                </div>

                {assessmentError && (
                  <div data-testid="assessment-error-message" className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{assessmentError}</span>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  data-testid="assessment-analyze-button" 
                  disabled={assessmentLoading} 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                >
                  {assessmentLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Analyzing page (~20s)...</>
                  ) : (
                    <><ListChecks className="w-5 h-5" />Run Page Assessment</>
                  )}
                </button>
              </form>
            </div>

            {assessmentLoading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Running comprehensive assessment...</p>
                    <p className="text-sm text-gray-500">Analyzing UI/UX, content, and generating personalized recommendations</p>
                  </div>
                </div>
              </div>
            )}

            {assessmentResult && !assessmentLoading && <PageAssessmentResults result={assessmentResult} />}

            {!assessmentResult && !assessmentLoading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to assess your page</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Enter your website URL, select your business type and goal to get personalized UI/UX insights, content analysis, and actionable improvement checklists.
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-xs text-gray-500">
                  <div className="bg-white rounded-lg p-3 border">
                    <Layout className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p>UI/UX Analysis</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <BookOpen className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p>Content Review</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <ListChecks className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p>Custom Checklists</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <PenTool className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p>Rewrite Suggestions</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">Powered by AI • Marketing comparison & performance analysis</div>
      </footer>
    </div>
  );
}

export default App;
