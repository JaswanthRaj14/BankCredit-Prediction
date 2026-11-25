const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Check backend health status.
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch root endpoint for API info.
 */
export async function fetchApiInfo() {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API info request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Send prediction request to the original 146-feature model.
 * @param {Object} features - The 146 feature key-value pairs.
 */
export async function predict(features) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ features }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    if (response.status === 422 && errorBody?.detail) {
      const detail = errorBody.detail;

      if (detail.missing_features || detail.extra_features) {
        const parts = [];
        if (detail.missing_features?.length) {
          parts.push(`Missing features (${detail.missing_features.length}): ${detail.missing_features.slice(0, 10).join(', ')}${detail.missing_features.length > 10 ? '...' : ''}`);
        }
        if (detail.extra_features?.length) {
          parts.push(`Extra features (${detail.extra_features.length}): ${detail.extra_features.slice(0, 10).join(', ')}${detail.extra_features.length > 10 ? '...' : ''}`);
        }
        throw new Error(parts.join('\n'));
      }

      if (Array.isArray(detail)) {
        const messages = detail.map((err) => `${err.loc?.join(' → ') || 'unknown'}: ${err.msg}`);
        throw new Error(`Validation error:\n${messages.join('\n')}`);
      }

      throw new Error(`Validation error: ${JSON.stringify(detail)}`);
    }

    if (response.status === 400 && errorBody?.detail) {
      throw new Error(`Model error: ${errorBody.detail}`);
    }

    throw new Error(
      errorBody?.detail
        ? `Server error: ${JSON.stringify(errorBody.detail)}`
        : `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Send prediction request to the simplified 10-feature model.
 * @param {Object} formData - The 10 feature values.
 */
export async function predictSimple(formData) {
  const response = await fetch(`${API_BASE_URL}/predict-simple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);

    if (response.status === 422 && errorBody?.detail) {
      const detail = errorBody.detail;

      if (Array.isArray(detail)) {
        const messages = detail.map((err) => {
          const field = err.loc?.slice(-1)?.[0] || 'unknown';
          return `${field}: ${err.msg}`;
        });
        throw new Error(`Validation error:\n${messages.join('\n')}`);
      }

      throw new Error(`Validation error: ${JSON.stringify(detail)}`);
    }

    if (response.status === 400 && errorBody?.detail) {
      throw new Error(`Model error: ${errorBody.detail}`);
    }

    throw new Error(
      errorBody?.detail
        ? `Server error: ${JSON.stringify(errorBody.detail)}`
        : `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch simplified model metadata.
 */
export async function fetchSimpleModelInfo() {
  const response = await fetch(`${API_BASE_URL}/model-info-simple`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Model info request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export { API_BASE_URL };
