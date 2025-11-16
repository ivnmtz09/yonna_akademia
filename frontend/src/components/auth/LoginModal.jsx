import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Modal from '../common/Modal';
import LoginForm from './LoginForm';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      closeOnOverlayClick={true}
    >
      <div className="relative p-1">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
        
        <LoginForm
          onSwitchToRegister={onSwitchToRegister}
          onSuccess={handleSuccess}
        />
      </div>
    </Modal>
  );
};

export default LoginModal;