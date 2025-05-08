import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Toast = ({ message, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
    onClick={() => navigate('/trades')}
    className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
      {message}
    </div>
  );
};

export default Toast;
