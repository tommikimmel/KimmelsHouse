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
      bgColor: '',
      borderColor: '',
      iconColor: ''
    },
    error: {
      icon: AlertCircle,
      bgColor: '',
      borderColor: '',
      iconColor: ''
    },
    warning: {
      icon: AlertTriangle,
      bgColor: '',
      borderColor: '',
      iconColor: ''
    }
  };

  const config = types[type] || types.success;
  const Icon = config.icon;

  return (
    <div className={`toast ${type}`}>
      <Icon />
      <p>{message}</p>
      <button
        className="btn btn-secondary"
        onClick={() => onClose(id)}
      >
        <X />
      </button>
    </div>
  );
};

export default Toast;
