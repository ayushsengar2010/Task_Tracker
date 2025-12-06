// Button Component
'use client';

export const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  className = '', 
  disabled = false,
  variant = 'primary'
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  required = false,
  className = ''
}) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      required={required}
      className={`border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black ${className}`}
    />
  );
};

// Select Component
export const Select = ({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  label = ''
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>}
      <select 
        value={value} 
        onChange={onChange}
        className={`border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black bg-white ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Card Component
export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// Alert Component
export const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  return (
    <div className={`border p-4 rounded mb-4 flex justify-between items-center ${colors[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="font-bold opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Loading Spinner
export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
  );
};

// Empty State
export const EmptyState = ({ title, description, icon = '📭' }) => {
  return (
    <div className="text-center py-12 text-gray-500">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};
