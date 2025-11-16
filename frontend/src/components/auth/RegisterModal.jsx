import React from 'react';
import { X } from 'lucide-react';

import Modal from '../common/Modal';
import RegisterForm from './RegisterForm';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      closeOnOverlayClick={true}
    >
      <div className="relative p-1">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        
        <RegisterForm
          onSwitchToLogin={onSwitchToLogin}
          onSuccess={handleSuccess}
        />
      </div>
    </Modal>
  );
};

export default RegisterModal;