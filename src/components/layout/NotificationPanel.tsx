import React from 'react';
import { useApp } from '../../store/AppContext';
import { NavigationPage } from '../../types';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';

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
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-[#0b1120] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-150 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#11192d]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Notifications</span>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No notifications right now
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.linkPage)}
              className={`p-3.5 flex gap-3 items-start cursor-pointer hover:bg-slate-50 dark:hover:bg-[#162038] transition-colors ${
                !item.read ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
              }`}
            >
              <div className="mt-0.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    !item.read ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{item.title}</h5>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
                {item.linkPage && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 hover:underline">
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
