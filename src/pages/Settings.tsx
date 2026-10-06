import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { 
  User, 
  Sliders, 
  Download, 
  Save, 
  Smartphone,
  Moon,
  Sun
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, setUser, showToast, records, goals, theme, setTheme } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'integrations'>('profile');

  // Profile State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [country, setCountry] = useState(user.country);

  // Preference State
  const [unitPreference, setUnitPreference] = useState<'metric' | 'imperial'>(user.unitPreference || 'metric');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user.weeklyDigest ?? true);

  // Security State
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CW';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      email,
      country,
      unitPreference,
      themePreference: theme,
      notificationsEnabled,
      weeklyDigest,
    });
    showToast('Settings saved successfully', 'success');
  };

  const handleExportAllJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user,
      emissionRecords: records,
      sustainabilityGoals: goals,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbonwise_full_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Full data archive exported', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your credentials, theme appearance, regional units, and notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle showLabel={true} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold overflow-x-auto pb-px">
        {[
          { key: 'profile', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
          { key: 'preferences', label: 'Preferences & Theme', icon: <Sliders className="w-3.5 h-3.5" /> },
          { key: 'security', label: 'Security & Auth', icon: <Smartphone className="w-3.5 h-3.5" /> },
          { key: 'integrations', label: 'Data Export & Integrations', icon: <Download className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === t.key
                ? 'border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-6 text-xs transition-colors">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {user.userType} Account
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Joined {user.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 dark:text-slate-300">Country of Residence</label>
              <input
                type="text"
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Used to calibrate national grid electricity carbon intensities (e.g. India 0.82 kg/kWh).
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Preferences Form */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-6 text-xs transition-colors">
          {/* Theme Switch Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Theme & Appearance</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-3">Choose your interface display preference</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  theme === 'light' 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#11192d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Light Theme</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Crisp, clean daytime layout (Default)</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="theme" 
                  checked={theme === 'light'} 
                  onChange={() => setTheme('light')} 
                  className="accent-emerald-600"
                />
              </div>

              <div 
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  theme === 'dark' 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#11192d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Dark Theme</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Midnight slate & navy palette (#070b14)</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="theme" 
                  checked={theme === 'dark'} 
                  onChange={() => setTheme('dark')} 
                  className="accent-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Measurement Standards</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-3">Configure preferred units for distance and mass</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-[#11192d]">
                <label className="block font-semibold text-slate-800 dark:text-slate-200">Unit Standard System</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="unitSystem"
                      checked={unitPreference === 'metric'}
                      onChange={() => setUnitPreference('metric')}
                      className="accent-emerald-600"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Metric (km, kg CO₂)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="unitSystem"
                      checked={unitPreference === 'imperial'}
                      onChange={() => setUnitPreference('imperial')}
                      className="accent-emerald-600"
                    />
                    <span className="text-slate-700 dark:text-slate-300">Imperial (miles, lbs CO₂)</span>
                  </label>
                </div>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-[#11192d]">
                <label className="block font-semibold text-slate-800 dark:text-slate-200">Regional Electricity Factor</label>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                  Calibrated to {user.country} national baseline: <strong>0.82 kg CO₂/kWh</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Notifications & Reports</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-3">Control which insights get pushed to your email</p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#11192d] cursor-pointer">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={e => setWeeklyDigest(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Weekly Sustainability Digest</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Receive an automated weekly email summarizing your footprint shifts and Eco Score.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#11192d] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={e => setNotificationsEnabled(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Goal Threshold & Spike Alerts</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Notify me when an activity exceeds monthly budget thresholds or a goal deadline is near.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Security Form */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-6 text-xs transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Change Account Password</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Ensure your credentials use at least 8 alphanumeric characters</p>

            <form
              onSubmit={e => {
                e.preventDefault();
                showToast('Password updated securely', 'success');
                setCurrentPw('');
                setNewPw('');
              }}
              className="space-y-3 max-w-md"
            >
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">New Password</label>
                <input
                  type="password"
                  required
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Active Sessions</h3>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11192d] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Chrome on macOS (Current Session)</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Bengaluru, India • IP: 103.21.244.12</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Active Now
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Integrations & Export */}
      {activeTab === 'integrations' && (
        <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-6 text-xs transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Export Data & GDPR Compliance</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Download a full archival package of your emission audit logs and goals.</p>

            <button
              onClick={handleExportAllJSON}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#11192d] rounded-xl font-semibold text-slate-800 dark:text-slate-200 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Download JSON Data Archive ({records.length} records)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Smart Meter & IoT Integrations</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Connect automated utility meters or telematics</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#11192d] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Smart Electric Meter Webhook</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Auto-sync daily kWh consumption from provider API</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  Available in Enterprise
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#11192d] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Vehicle OBD-II Telematics</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Track odometer and fuel consumption without manual entry</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
