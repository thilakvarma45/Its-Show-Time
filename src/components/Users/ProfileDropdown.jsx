import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Bookmark, Heart, ChevronDown, HelpCircle } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

const ProfileDropdown = ({ user, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter menu items based on user role
  const isOwner = user?.role === 'owner' || user?.role === 'OWNER';

  const allMenuItems = [
    { icon: Settings, label: 'Settings', action: 'settings', roles: ['user', 'owner'] },
    { icon: Bookmark, label: 'My Bookings', action: 'bookings', roles: ['user'] },
    { icon: Heart, label: 'Wishlist', action: 'wishlist', roles: ['user'] },
    { type: 'divider', roles: ['user', 'owner'] },
    { icon: HelpCircle, label: 'Help & Support', action: 'help-support', roles: ['user', 'owner'] },
    { type: 'divider', roles: ['user', 'owner'] },
    { icon: LogOut, label: 'Logout', action: 'logout', isDanger: true, roles: ['user', 'owner'] },
  ];

  const menuItems = allMenuItems.filter(item =>
    item.roles.includes(isOwner ? 'owner' : 'user')
  );

  const handleItemClick = (action) => {
    setIsOpen(false);
    if (action === 'logout') {
      onLogout();
    } else {
      onNavigate(action);
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-slate-100 transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white group-hover:shadow-lg group-hover:scale-105 transition-all duration-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></div>
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-slate-800 leading-tight">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {user?.role?.toLowerCase() === 'owner' ? 'Host' : 'Movie Lover'}
          </p>
        </div>

        {/* Chevron Icon */}
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 hidden md:block ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-br from-violet-50 to-fuchsia-50">
              <div className="flex items-center gap-3 mb-2">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                item.type === 'divider' ? (
                  <div key={index} className="my-2 mx-4 border-t border-slate-200" />
                ) : (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item.action)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${item.isDanger
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
