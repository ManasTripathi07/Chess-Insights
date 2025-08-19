import React from 'react'

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card p-6 border-red-200 bg-red-50">
      <div className="flex items-center mb-3">
        <div className="text-red-500 text-xl mr-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800">Error</h3>
      </div>
      <p className="text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage