import { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

const Toast = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-blue-500/90',
      borderColor: 'border-blue-400',
      iconColor: 'text-white'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-900/90',
      borderColor: 'border-red-700',
      iconColor: 'text-red-300'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-700/90',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-200'
    }
  };

  const config = types[type] || types.success;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} backdrop-blur-md border-2 rounded-lg p-4 shadow-2xl flex items-center gap-3 min-w-[320px] animate-slide-in`}>
      <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
      <p className="text-white flex-1 font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-white/70 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
