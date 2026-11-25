import { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Binary,
  Hash,
  Workflow,
  Target,
  ArrowRightLeft,
  BarChart3,
  Layers,
} from 'lucide-react';
import { fetchSimpleModelInfo } from '../services/api';

const originalModelDetails = [
  {
    label: 'Algorithm',
    value: 'Random Forest',
    description: 'Ensemble learning method using multiple decision trees.',
    icon: BrainCircuit,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Model Type',
    value: 'Binary Classification',
    description: 'Classifies credit history into two categories.',
    icon: Binary,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Input Features',
    value: '146',
    description: 'Derived from customer demographics, accounts, and enquiry data.',
    icon: Hash,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    label: 'Preprocessing',
    value: 'Included in Pipeline',
    description: 'All preprocessing steps are saved in the joblib pipeline artifact.',
    icon: Workflow,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    label: 'Target Variable',
    value: 'Bad_label',
    description: 'Binary target indicating credit history quality.',
    icon: Target,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    label: 'Target Mapping',
    value: '0 → Good, 1 → Bad',
    description: 'Class 0 = Good credit history, Class 1 = Bad credit history.',
    icon: ArrowRightLeft,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

export default function ModelInfo() {
  const [activeTab, setActiveTab] = useState('simplified');
  const [simpleInfo, setSimpleInfo] = useState(null);

  useEffect(() => {
    fetchSimpleModelInfo()
      .then(setSimpleInfo)
      .catch(() => setSimpleInfo(null));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Model Information</h1>
        <p className="text-sm text-gray-500 mt-1">
          Details about the trained machine learning models and preprocessing pipelines.
        </p>
      </div>

      {/* Tab switch */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('simplified')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'simplified'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Simplified (10 Features)
          </span>
        </button>
        <button
          onClick={() => setActiveTab('original')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'original'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            Original (146 Features)
          </span>
        </button>
      </div>

      {/* Simplified model tab */}
      {activeTab === 'simplified' && (
        <div className="space-y-6">
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailCard
              icon={BrainCircuit} color="text-blue-600" bg="bg-blue-50"
              label="Algorithm" value="Random Forest (Simplified)"
              description="Trained on 10 selected features from feature importance analysis."
            />
            <DetailCard
              icon={Hash} color="text-indigo-600" bg="bg-indigo-50"
              label="Input Features" value="10"
              description="Selected from the top features by importance in the original model."
            />
            <DetailCard
              icon={Binary} color="text-purple-600" bg="bg-purple-50"
              label="Model Type" value="Binary Classification"
              description="Same target as the original: Good vs. Bad credit history."
            />
          </div>

          {/* Performance metrics */}
          {simpleInfo?.metrics && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-navy-600" />
                Test Set Performance Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'ROC-AUC', value: simpleInfo.metrics.test_roc_auc },
                  { label: 'Gini', value: simpleInfo.metrics.test_gini },
                  { label: 'PR-AUC', value: simpleInfo.metrics.test_pr_auc },
                  { label: 'CV ROC-AUC', value: simpleInfo.metrics.cv_roc_auc_mean, std: simpleInfo.metrics.cv_roc_auc_std },
                ].map(({ label, value, std }) => (
                  <div key={label} className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {value != null ? value.toFixed(4) : '—'}
                    </p>
                    {std != null && (
                      <p className="text-xs text-gray-400 mt-0.5">± {std.toFixed(4)}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> The simplified 10-feature model uses a subset of features and is expected
                  to have lower performance than the original 146-feature model. This trade-off provides a
                  user-friendly interface suitable for demonstration purposes.
                </p>
              </div>
            </div>
          )}

          {/* Feature list */}
          {simpleInfo?.feature_labels && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Features</h2>
              <div className="space-y-2">
                {Object.entries(simpleInfo.feature_labels).map(([key, label], i) => (
                  <div key={key} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 font-mono">{key}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Architecture</h2>
            <div className="flex flex-wrap items-center gap-3">
              {['10 Numeric Features', '→', 'Median Imputation', '→', 'Standard Scaling', '→', 'Random Forest', '→', 'Prediction (0 or 1)'].map(
                (step, i) =>
                  step === '→' ? (
                    <span key={i} className="text-gray-300 text-xl">→</span>
                  ) : (
                    <span
                      key={i}
                      className="px-4 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm font-medium text-navy-800"
                    >
                      {step}
                    </span>
                  )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Original model tab */}
      {activeTab === 'original' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {originalModelDetails.map(({ label, value, description, icon: Icon, color, bg }) => (
              <DetailCard
                key={label} icon={Icon} color={color} bg={bg}
                label={label} value={value} description={description}
              />
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Architecture</h2>
            <div className="flex flex-wrap items-center gap-3">
              {['Raw Input (146 features)', '→', 'Preprocessing Pipeline', '→', 'Random Forest Classifier', '→', 'Prediction (0 or 1)'].map(
                (step, i) =>
                  step === '→' ? (
                    <span key={i} className="text-gray-300 text-xl">→</span>
                  ) : (
                    <span
                      key={i}
                      className="px-4 py-2 bg-navy-50 border border-navy-200 rounded-lg text-sm font-medium text-navy-800"
                    >
                      {step}
                    </span>
                  )
              )}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> The original 146-feature model is accessible via the developer JSON
              interface at <code className="bg-amber-100 px-1 rounded">POST /predict</code>. Use the
              simplified model for the form-based interface.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ icon: Icon, color, bg, label, value, description }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${bg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-base font-semibold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
