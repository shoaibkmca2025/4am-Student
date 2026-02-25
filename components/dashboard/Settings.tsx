import React from 'react';
import { User, Bell, Lock, Globe, Moon, CreditCard } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Account Settings</h2>
          <p className="text-slate-400">Manage your profile, preferences, and security.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="saas-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h3>
            <button className="text-sm text-primary hover:text-primary/80 font-medium">Edit</button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Full Name</label>
              <input type="text" value="John Doe" disabled className="saas-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Email Address</label>
              <input type="email" value="john@example.com" disabled className="saas-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Phone Number</label>
              <input type="tel" value="+1 (555) 123-4567" disabled className="saas-input w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Location</label>
              <input type="text" value="New York, USA" disabled className="saas-input w-full" />
            </div>
          </div>
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
                <input type="checkbox" className="sr-only peer" defaultChecked />
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
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Billing Section */}
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
            <button className="w-full text-left p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-between group">
              <div>
                <h4 className="font-medium text-slate-200">Change Password</h4>
                <p className="text-xs text-slate-400">Update your account password</p>
              </div>
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Update</span>
            </button>
            
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
          <button className="px-6 py-3 bg-error/10 hover:bg-error/20 text-error border border-error/20 rounded-lg font-bold text-sm transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
