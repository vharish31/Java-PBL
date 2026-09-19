import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  User, 
  Bell, 
  Shield, 
  Sliders, 
  Globe, 
  Download, 
  Save, 
  CheckCircle2, 
  Key, 
  Smartphone,
  Cpu
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, setUser, showToast, records, goals } = useApp();

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
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your account credentials, regional measurement units, and notification frequencies
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        {[
          { key: 'profile', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
          { key: 'preferences', label: 'Preferences & Units', icon: <Sliders className="w-3.5 h-3.5" /> },
          { key: 'security', label: 'Security & Auth', icon: <Shield className="w-3.5 h-3.5" /> },
          { key: 'integrations', label: 'Data & Integrations', icon: <Cpu className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${
              activeTab === t.key
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg border-2 border-emerald-200">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
              <p className="text-slate-400">{user.email}</p>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                Verified Pro Plan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Country / Region</label>
              <input
                type="text"
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Used to calibrate national grid electricity carbon intensities (e.g. India 0.82 kg/kWh).
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
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
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Measurement Standards</h3>
            <p className="text-slate-500 mb-3">Configure preferred units for distance and mass</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                <label className="block font-semibold text-slate-800">Unit Standard System</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="unitSystem"
                      checked={unitPreference === 'metric'}
                      onChange={() => setUnitPreference('metric')}
                      className="accent-emerald-600"
                    />
                    <span>Metric (km, kg CO₂)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="unitSystem"
                      checked={unitPreference === 'imperial'}
                      onChange={() => setUnitPreference('imperial')}
                      className="accent-emerald-600"
                    />
                    <span>Imperial (miles, lbs CO₂)</span>
                  </label>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                <label className="block font-semibold text-slate-800">Regional Electricity Factor</label>
                <p className="text-slate-500 text-[11px] mt-1">
                  Calibrated to {user.country} national baseline: <strong>0.82 kg CO₂/kWh</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Notifications & Reports</h3>
            <p className="text-slate-500 mb-3">Control which insights get pushed to your email</p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={e => setWeeklyDigest(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <div>
                  <p className="font-semibold text-slate-900">Weekly Sustainability Digest</p>
                  <p className="text-slate-500 text-[11px]">
                    Receive an automated Monday email summarizing your weekly footprint shifts and Eco Score.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={e => setNotificationsEnabled(e.target.checked)}
                  className="mt-0.5 accent-emerald-600 rounded"
                />
                <div>
                  <p className="font-semibold text-slate-900">Goal Threshold & Spike Alerts</p>
                  <p className="text-slate-500 text-[11px]">
                    Notify me when an activity exceeds monthly budget thresholds or a goal deadline is near.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
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
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Change Account Password</h3>
            <p className="text-slate-500 mb-4">Ensure your credentials use at least 8 alphanumeric characters</p>

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
                <label className="block font-medium text-slate-700">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
              >
                Update Password
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Active Sessions</h3>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">Chrome on macOS (Current Session)</p>
                  <p className="text-[10px] text-slate-400">Bengaluru, India • IP: 103.21.244.12</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Active Now
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Integrations & Export */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Export Data & GDPR Compliance</h3>
            <p className="text-slate-500 mb-4">Download a full archival package of your emission audit logs and goals.</p>

            <button
              onClick={handleExportAllJSON}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-800 shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download JSON Data Archive ({records.length} records)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Smart Meter & IoT Integrations</h3>
            <p className="text-slate-500 mb-4">Connect automated utility meters or telematics</p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Smart Electric Meter Webhook</p>
                  <p className="text-[11px] text-slate-500">Auto-sync daily kWh consumption from provider API</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                  Available in Enterprise
                </span>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Vehicle OBD-II Telematics</p>
                  <p className="text-[11px] text-slate-500">Track odometer and fuel consumption without manual entry</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
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
