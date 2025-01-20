'use client';

import React from 'react';

interface ModalProps {
  title: string; // The title for the modal
  isOpen: boolean; // Whether the modal is open or not
  onClose: () => void; // Function to close the modal
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  return (
    <>
      {/* Conditionally render modal based on isOpen */}
      {isOpen && (
        <>
          {/* Overlay/Backdrop (blackout effect) */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose} // Close modal when clicking outside
          ></div>
          
          {/* Modal */}
          <dialog open className="modal z-50">
            <div className="modal-box">
              <form method="dialog">
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={onClose}
                >
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">{title}</h3>
              <div>{children}</div>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default Modal;
