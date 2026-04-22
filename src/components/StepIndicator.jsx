export default function StepIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Étapes">
      <ol className="flex items-center gap-0">
        {steps.map((step, idx) => {
          const done = step.id < currentStep
          const active = step.id === currentStep
          return (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors
                    ${done ? 'bg-blue-600 border-blue-600 text-white' : ''}
                    ${active ? 'bg-white border-blue-600 text-blue-600' : ''}
                    ${!done && !active ? 'bg-white border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {done ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium ${active ? 'text-blue-600' : done ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 mb-5 transition-colors ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
