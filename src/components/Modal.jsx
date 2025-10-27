import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { btn, card } from '../theme/styles';

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

const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'large',
  variant = 'elevated',
  padding = 'lg',
  showCloseButton = true,
  closeButtonAriaLabel = 'Close modal',
}) => {
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

  const sizeClassMap = {
    sm: 'sm:max-w-sm md:max-w-md',
    small: 'sm:max-w-sm md:max-w-md',
    md: 'sm:max-w-lg md:max-w-xl',
    medium: 'sm:max-w-lg md:max-w-xl',
    lg: 'sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
    large: 'sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
    full: 'sm:max-w-3xl md:max-w-5xl lg:max-w-6xl max-w-full',
  };

  const normalizedSizeKey = (() => {
    if (typeof size !== 'string') return 'large';
    const key = size.toLowerCase();
    if (sizeClassMap[key]) return key;
    if (key === 'xs') return 'sm';
    if (key === 'xl') return 'large';
    return 'large';
  })();

  const panelWrapperClassName = `relative w-full max-w-[90vw] ${sizeClassMap[normalizedSizeKey]}`;

  const panelClassName = card({
    variant,
    padding,
    className: 'relative w-full overflow-hidden',
  });

  const closeButtonClassName = btn({
    variant: 'ghost',
    size: 'sm',
    className:
      'absolute right-4 top-4 h-9 w-9 rounded-full p-0 text-text-secondary backdrop-blur-sm hover:text-text-primary focus-visible:ring-primary/30',
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--color-overlay-rgb,_15_23_42)/0.65)] backdrop-blur-md px-4 py-8 sm:px-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => onClose?.()}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className={panelWrapperClassName}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={panelClassName}>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={() => onClose?.()}
                  className={closeButtonClassName}
                  aria-label={closeButtonAriaLabel}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
