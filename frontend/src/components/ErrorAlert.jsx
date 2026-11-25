import { AlertTriangle, XCircle } from 'lucide-react';

/**
 * Displays API or validation errors.
 * @param {{ message: string | null, onDismiss?: () => void }} props
 */
export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-red-800 mb-1">Error</h4>
        <pre className="text-sm text-red-700 whitespace-pre-wrap break-words font-sans">
          {message}
        </pre>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 flex-shrink-0"
          aria-label="Dismiss"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
