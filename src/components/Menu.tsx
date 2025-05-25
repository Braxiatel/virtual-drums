'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Menu = ({ isOpen, onClose }: MenuProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path);
  };

  const menuItems = [
    {
      title: 'Beats',
      description: 'Play rhythm games',
      icon: '🎵',
      path: '/play',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Settings',
      description: 'Customize controls & audio',
      icon: '⚙️',
      path: '/settings',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 max-w-md w-full mx-4">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  🥁 Virtual Drums
                </h1>
                <p className="text-gray-400">Choose your mode</p>
              </div>

              <div className="space-y-4">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.path}
                    className={`w-full p-4 rounded-xl bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg hover:shadow-xl transition-shadow`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{item.title}</div>
                        <div className="text-sm opacity-90">{item.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="w-full mt-6 p-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Back to Kit
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 