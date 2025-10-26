import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.2, ease: 'easeIn' } },
};

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm px-4 py-8 sm:px-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => onClose?.()}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative w-full max-w-[80vw] sm:max-w-md md:max-w-xl lg:max-w-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onClose?.()}
              className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-500 shadow hover:bg-white hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
