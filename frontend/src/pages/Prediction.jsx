import { useState } from 'react';
import {
  Send,
  Trash2,
  CreditCard,
  History,
  Search,
  Clock,
  Loader2,
  Info,
} from 'lucide-react';
import ResultCard from '../components/ResultCard';
import ErrorAlert from '../components/ErrorAlert';
import { predictSimple } from '../services/api';

// Field definitions — mapped from the 10 engineered features
const FIELD_SECTIONS = [
  {
    id: 'repayment',
    title: 'Repayment Behaviour',
    icon: History,
    description: 'Payment history and on-time payment records across all accounts.',
    fields: [
      {
        name: 'payment_history_zero_dpd_count',
        label: 'On-Time Payments (Zero DPD Count)',
        tooltip: 'Total count of months across all accounts where payments were made on time (0 days past due).',
        type: 'number',
        placeholder: 'e.g. 79',
        min: 0,
        step: 1,
      },
      {
        name: 'payment_history_numeric_dpd_count',
        label: 'Numeric Payment History Entries',
        tooltip: 'Total count of numeric (DPD-based) payment history entries across all accounts.',
        type: 'number',
        placeholder: 'e.g. 79',
        min: 0,
        step: 1,
      },
      {
        name: 'payment_history_total_entries',
        label: 'Total Payment History Entries',
        tooltip: 'Total number of payment history entries (both numeric DPD and status codes) across all accounts.',
        type: 'number',
        placeholder: 'e.g. 80',
        min: 0,
        step: 1,
      },
    ],
  },
  {
    id: 'account',
    title: 'Account Information',
    icon: CreditCard,
    description: 'Credit limits, balances, and payment timing.',
    fields: [
      {
        name: 'mean_diff_lastpaymt_opened_dt',
        label: 'Avg. Days: Last Payment → Account Opening',
        tooltip: 'Average number of days between the last payment date and account opening date, across all accounts.',
        type: 'number',
        placeholder: 'e.g. 288.5',
        min: 0,
        step: 0.1,
      },
      {
        name: 'ratio_curbalance_creditlimit',
        label: 'Credit Utilisation Ratio',
        tooltip: 'Total current balance divided by total credit limit. Values above 1.0 indicate over-utilisation.',
        type: 'number',
        placeholder: 'e.g. 0.75',
        step: 0.01,
      },
      {
        name: 'total_creditlimit',
        label: 'Total Credit Limit (₹)',
        tooltip: 'Sum of credit limits across all revolving credit accounts (e.g., credit cards).',
        type: 'number',
        placeholder: 'e.g. 42000',
        min: 0,
        step: 1,
      },
    ],
  },
  {
    id: 'enquiry',
    title: 'Credit Enquiry Information',
    icon: Search,
    description: 'Credit bureau enquiry activity and recency.',
    fields: [
      {
        name: 'count_enquiry_recency_365',
        label: 'Credit Enquiries (Last 365 Days)',
        tooltip: 'Number of credit bureau enquiries made within the last 365 days.',
        type: 'number',
        placeholder: 'e.g. 11',
        min: 0,
        step: 1,
      },
      {
        name: 'mean_diff_open_enquiry_dt',
        label: 'Avg. Days: Report Date → Enquiry Date',
        tooltip: 'Average number of days between the report reference date and each enquiry date.',
        type: 'number',
        placeholder: 'e.g. 331.6',
        min: 0,
        step: 0.1,
      },
    ],
  },
  {
    id: 'history',
    title: 'Account History',
    icon: Clock,
    description: 'Age and tenure of credit accounts.',
    fields: [
      {
        name: 'min_account_age_days',
        label: 'Youngest Account Age (Days)',
        tooltip: 'Age in days of the most recently opened account (from opening date to reporting date).',
        type: 'number',
        placeholder: 'e.g. 26',
        min: 0,
        step: 1,
      },
      {
        name: 'mean_account_age_days',
        label: 'Average Account Age (Days)',
        tooltip: 'Average age in days of all accounts (from opening date to reporting date).',
        type: 'number',
        placeholder: 'e.g. 312.4',
        min: 0,
        step: 0.1,
      },
    ],
  },
];

const INITIAL_FORM = {};
FIELD_SECTIONS.forEach((section) => {
  section.fields.forEach((field) => {
    INITIAL_FORM[field.name] = '';
  });
});

export default function Prediction() {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tooltipField, setTooltipField] = useState(null);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setFormData({ ...INITIAL_FORM });
    setResult(null);
    setError(null);
    setTooltipField(null);
  };

  const filledCount = Object.values(formData).filter((v) => v !== '' && v !== null && v !== undefined).length;

  const handlePredict = async () => {
    setError(null);
    setResult(null);

    // Validate: at least some fields should be filled
    if (filledCount === 0) {
      setError('Please fill in at least one field before predicting.');
      return;
    }

    // Build the payload — convert strings to numbers, preserve nulls for empty
    const payload = {};
    for (const [key, value] of Object.entries(formData)) {
      if (value === '' || value === null || value === undefined) {
        payload[key] = null;
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          setError(`Invalid number for "${key}": "${value}"`);
          return;
        }
        payload[key] = num;
      }
    }

    setLoading(true);
    try {
      const response = await predictSimple(payload);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Prediction request failed. Check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Credit Risk Prediction</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter credit profile information to assess credit history risk using
          the simplified 10-feature model.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Input form — takes 3 cols */}
        <div className="xl:col-span-3 space-y-5">
          {FIELD_SECTIONS.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Section header */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-navy-100 rounded-lg">
                      <SectionIcon className="w-4 h-4 text-navy-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-xs text-gray-500">{section.description}</p>
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="p-5 space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.name}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600 transition-colors relative"
                          onMouseEnter={() => setTooltipField(field.name)}
                          onMouseLeave={() => setTooltipField(null)}
                          onClick={() =>
                            setTooltipField(
                              tooltipField === field.name ? null : field.name
                            )
                          }
                          aria-label={`Info about ${field.label}`}
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tooltip */}
                      {tooltipField === field.name && (
                        <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">{field.tooltip}</p>
                        </div>
                      )}

                      <input
                        id={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        min={field.min}
                        step={field.step}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePredict}
              disabled={loading || filledCount === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Predicting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Predict Credit Risk
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Field count */}
          <div className="text-center">
            <span className="text-xs text-gray-400">
              {filledCount} of 10 fields filled
            </span>
          </div>
        </div>

        {/* Result panel — takes 2 cols */}
        <div className="xl:col-span-2 space-y-4">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
          <ResultCard result={result} loading={loading} />

          {!result && !loading && !error && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 flex flex-col items-center justify-center text-center sticky top-8">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <CreditCard className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                No Prediction Yet
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Fill in the credit profile information and click{' '}
                <strong>Predict Credit Risk</strong> to assess the credit history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
