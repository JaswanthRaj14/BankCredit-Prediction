import {
  Landmark,
  GraduationCap,
  Code2,
  Server,
  BrainCircuit,
  Layout,
  AlertTriangle,
  Github,
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About BankCredit</h1>
        <p className="text-sm text-gray-500 mt-1">
          Project background, technology stack, and purpose.
        </p>
      </div>

      {/* Objective */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-navy-600" />
          Project Objective
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          BankCredit is a credit history risk prediction platform that classifies customers into
          <strong> Good credit history</strong> (class 0) or <strong>Bad credit history</strong> (class 1)
          using a trained Random Forest classifier. The project demonstrates the complete lifecycle of
          a machine learning application — from data analysis and model training to API deployment and
          frontend integration.
        </p>
      </div>

      {/* ML Approach */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-navy-600" />
          Machine Learning Approach
        </h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            Data sourced from customer demographics, account information, and credit enquiry records.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            Feature engineering produced 146 input features (categorical and numerical).
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            A Random Forest classifier was trained for binary classification.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            The complete preprocessing pipeline is saved and loaded as a single joblib artifact.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            Predictions include class probabilities for transparency.
          </li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-navy-600" />
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TechCard
            icon={Server}
            title="Backend"
            tech="FastAPI"
            description="RESTful API serving the ML model with health check and prediction endpoints."
          />
          <TechCard
            icon={Layout}
            title="Frontend"
            tech="React + Vite"
            description="Modern SPA with Tailwind CSS, Lucide icons, and Recharts for data visualization."
          />
          <TechCard
            icon={BrainCircuit}
            title="ML Model"
            tech="Random Forest"
            description="Scikit-learn pipeline with preprocessing and classification in a single artifact."
          />
          <TechCard
            icon={GraduationCap}
            title="Purpose"
            tech="Portfolio Project"
            description="Educational and portfolio demonstration of an end-to-end ML deployment."
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800 mb-1">Important Disclaimer</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              This application is an <strong>experimental educational project</strong> and is not intended
              for real-world lending decisions. The predictions are model estimates based on training data
              and should not be used as the basis for actual credit approvals, rejections, or any
              financial decisions. Always consult qualified financial professionals for real
              credit assessments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechCard({ icon: Icon, title, tech, description }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <Icon className="w-5 h-5 text-navy-600 mb-2" />
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{tech}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
