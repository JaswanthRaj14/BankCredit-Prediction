import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

/**
 * Displays a small status badge for backend connection.
 * @param {{ status: 'connected' | 'disconnected' | 'checking' }} props
 */
export default function StatusBadge({ status }) {
  if (status === 'checking') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
        <Loader2 className="w-3 h-3 animate-spin" />
        Checking…
      </span>
    );
  }

  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" />
        Connected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3 h-3" />
      Disconnected
    </span>
  );
}
