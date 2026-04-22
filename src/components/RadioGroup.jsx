export default function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors text-sm
            ${value === opt.value
              ? 'border-blue-500 bg-blue-50 text-blue-800'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-blue-600"
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}
