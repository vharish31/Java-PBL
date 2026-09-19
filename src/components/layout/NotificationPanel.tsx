import React from 'react';
import { useApp } from '../../store/AppContext';
import { NavigationPage } from '../../types';
import { Bell, Check, CheckCheck, ExternalLink, X } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setCurrentPage } = useApp();

  if (!isOpen) return null;

  const handleItemClick = (id: string, linkPage?: string) => {
    markNotificationRead(id);
    if (linkPage) {
      setCurrentPage(linkPage as NavigationPage);
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-slate-800">Notifications</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No notifications right now
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.linkPage)}
              className={`p-3.5 flex gap-3 items-start cursor-pointer hover:bg-slate-50 transition-colors ${
                !item.read ? 'bg-emerald-50/30' : ''
              }`}
            >
              <div className="mt-0.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    !item.read ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-300'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-semibold text-slate-900 truncate">{item.title}</h5>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
                {item.linkPage && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1 hover:underline">
                    View in {item.linkPage} <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
