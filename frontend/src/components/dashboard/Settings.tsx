import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Globe, Moon, CreditCard, Save, X, Trash2, AlertTriangle, Check } from 'lucide-react';
import { userService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  userName?: string;
  userEmail?: string;
}

const Settings: React.FC<SettingsProps> = ({ userName: initialName = '', userEmail: initialEmail = '' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile State
  const [profile, setProfile] = useState({
    name: initialName,
    email: initialEmail,
    isEditing: false
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: true
  });

  // Password State
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
    isExpanded: false
  });

  // Delete Account State
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await userService.me();
      if (data && data.user) {
        setProfile(prev => ({
          ...prev,
          name: data.user.name,
          email: data.user.email
        }));
        if (data.user.preferences) {
          setPreferences({
            emailNotifications: data.user.preferences.emailNotifications ?? true,
            darkMode: data.user.preferences.darkMode ?? true
          });
        }
        // Update localStorage to keep sidebar in sync
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const response = await userService.updateMe({
        name: profile.name,
        email: profile.email
      });

      if (response && response.user) {
        setProfile(prev => ({ ...prev, isEditing: false }));
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userEmail', response.user.email);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async (key: string, value: boolean) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences); // Optimistic update

      await userService.updatePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to update preferences', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !value }));
    }
  };

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await userService.changePassword({ currentPassword: password.current, newPassword: password.new });

      setPassword({ current: '', new: '', confirm: '', isExpanded: false });
      setMessage({ type: 'success', text: 'Password changed successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await userService.deleteMe();
      localStorage.clear();
      navigate('/');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete account' });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Account Settings</h2>
          <p className="text-slate-400">Manage your profile, preferences, and security.</p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {message.text}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="saas-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h3>
            <button
              onClick={() => setProfile(prev => ({ ...prev, isEditing: !prev.isEditing }))}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              {profile.isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                disabled={!profile.isEditing}
                className={`saas-input w-full ${!profile.isEditing && 'opacity-60 cursor-not-allowed'}`}
                placeholder="Not set"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled={!profile.isEditing}
                className={`saas-input w-full ${!profile.isEditing && 'opacity-60 cursor-not-allowed'}`}
                placeholder="Not set"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Phone Number</label>
              <input type="tel" value="" disabled className="saas-input w-full opacity-60 cursor-not-allowed" placeholder="Not set" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Location</label>
              <input type="text" value="" disabled className="saas-input w-full opacity-60 cursor-not-allowed" placeholder="Not set" />
            </div>
          </div>

          {profile.isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="saas-button-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className="saas-card p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-slate-400" />
                <div>
                  <h4 className="font-medium text-slate-200">Email Notifications</h4>
                  <p className="text-xs text-slate-400">Receive updates about job matches and application status</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handleUpdatePreferences('emailNotifications', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-400" />
                <div>
                  <h4 className="font-medium text-slate-200">Dark Mode</h4>
                  <p className="text-xs text-slate-400">Toggle system theme preference</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.darkMode}
                  onChange={(e) => handleUpdatePreferences('darkMode', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Billing Section (Static for now) */}
        <div className="saas-card p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            Billing & Subscription
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div>
                <h4 className="font-medium text-slate-200">Free Plan</h4>
                <p className="text-xs text-slate-400">Basic access to student features</p>
              </div>
              <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-bold hover:bg-indigo-500/20 transition-colors">
                Upgrade to Pro
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div>
                <h4 className="font-medium text-slate-200">Payment Method</h4>
                <p className="text-xs text-slate-400">No payment method added</p>
              </div>
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Add</button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="saas-card p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-success" />
            Security
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
              <button
                onClick={() => setPassword(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
                className="w-full text-left p-4 hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-medium text-slate-200">Change Password</h4>
                  <p className="text-xs text-slate-400">Update your account password</p>
                </div>
                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                  {password.isExpanded ? 'Cancel' : 'Update'}
                </span>
              </button>

              {password.isExpanded && (
                <div className="p-4 pt-0 space-y-4 border-t border-slate-700/50 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Current Password</label>
                    <input
                      type="password"
                      value={password.current}
                      onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                      className="saas-input w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">New Password</label>
                    <input
                      type="password"
                      value={password.new}
                      onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                      className="saas-input w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Confirm New Password</label>
                    <input
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                      className="saas-input w-full"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading || !password.current || !password.new}
                      className="saas-button-primary"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="w-full text-left p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-between group">
              <div>
                <h4 className="font-medium text-slate-200">Two-Factor Authentication</h4>
                <p className="text-xs text-slate-400">Add an extra layer of security</p>
              </div>
              <span className="text-success font-medium">Enabled</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-6 py-3 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-bold text-sm transition-all"
            >
              Delete Account
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-error/10 p-4 rounded-lg border border-error/20">
              <span className="text-error text-sm font-medium">Are you sure? This action cannot be undone.</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-3 py-1 bg-error text-white rounded text-xs font-bold hover:bg-error/90"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
