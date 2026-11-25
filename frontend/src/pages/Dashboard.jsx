import { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  BrainCircuit,
  Hash,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Landmark,
  Layers,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { checkHealth, fetchApiInfo } from '../services/api';

export default function Dashboard() {
  const [health, setHealth] = useState({ status: 'checking', data: null });
  const [apiInfo, setApiInfo] = useState(null);

  const runHealthCheck = async () => {
    setHealth({ status: 'checking', data: null });
    try {
      const data = await checkHealth();
      setHealth({ status: 'connected', data });
    } catch {
      setHealth({ status: 'disconnected', data: null });
    }
  };

  const loadApiInfo = async () => {
    try {
      const data = await fetchApiInfo();
      setApiInfo(data);
    } catch {
      setApiInfo(null);
    }
  };

  useEffect(() => {
    runHealthCheck();
    loadApiInfo();
  }, []);

  const cards = [
    {
      title: 'Primary Model',
      value: apiInfo?.model || 'Random Forest',
      icon: BrainCircuit,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Full Model Features',
      value: apiInfo?.total_features ?? 146,
      icon: Hash,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Simplified Features',
      value: 10,
      icon: Layers,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Backend',
      value: health.status === 'connected' ? 'Online' : health.status === 'checking' ? '…' : 'Offline',
      icon: Server,
      color: health.status === 'connected' ? 'text-emerald-600' : 'text-gray-500',
      bg: health.status === 'connected' ? 'bg-emerald-50' : 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">BankCredit Risk Prediction Platform — Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={health.status} />
          <button
            onClick={() => { runHealthCheck(); loadApiInfo(); }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ title, value, icon: Icon, color, bg }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Project info + System status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-navy-600" />
            About BankCredit
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              BankCredit classifies customer credit history as either{' '}
              <strong>Good</strong> or <strong>Bad</strong> using trained Random Forest models.
            </p>
            <p>
              Two models are available: the full <strong>146-feature</strong> model (developer
              JSON interface) and a simplified <strong>10-feature</strong> form-based model for
              interactive demonstration.
            </p>
            <p>
              This application is an educational demonstration of an end-to-end ML deployment —
              from data science notebook to FastAPI backend and React frontend.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-navy-600" />
            System Status
          </h2>
          <div className="space-y-3">
            <StatusRow
              label="Backend API"
              ok={health.status === 'connected'}
              checking={health.status === 'checking'}
            />
            <StatusRow
              label="Full Model (146 features)"
              ok={health.data?.model_loaded === true}
              checking={health.status === 'checking'}
            />
            <StatusRow
              label="Simplified Model (10 features)"
              ok={health.data?.simple_model_loaded === true}
              checking={health.status === 'checking'}
            />
            <StatusRow
              label="Prediction Endpoints"
              ok={health.status === 'connected'}
              checking={health.status === 'checking'}
            />
          </div>

          {health.status === 'disconnected' && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                The backend is not reachable. Make sure the FastAPI server is running
                on <code className="bg-amber-100 px-1 rounded">http://127.0.0.1:8000</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, ok, checking }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      {checking ? (
        <span className="text-xs text-yellow-600">Checking…</span>
      ) : ok ? (
        <span className="flex items-center gap-1 text-xs text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" /> Active
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <XCircle className="w-3.5 h-3.5" /> Inactive
        </span>
      )}
    </div>
  );
}
