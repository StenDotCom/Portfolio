import React, { useState } from 'react';
import { isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { DataService } from '../lib/storage';
import { 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  UploadCloud, 
  RotateCcw, 
  ExternalLink, 
  Check, 
  Terminal,
  Copy
} from 'lucide-react';

interface SupabaseSettingsProps {
  onRefreshAll: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupabaseSettings: React.FC<SupabaseSettingsProps> = ({
  onRefreshAll,
  showToast,
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.ok) {
        showToast('Supabase connection verified!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || 'Connection error' });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncToSupabase = async () => {
    if (!isSupabaseConfigured) {
      showToast('Please configure Supabase credentials in .env first.', 'error');
      return;
    }

    setSyncing(true);
    try {
      const res = await DataService.syncLocalToSupabase();
      if (res.ok) {
        showToast(`Successfully synchronized records to Supabase!`, 'success');
      } else {
        showToast(res.error || 'Failed to sync to Supabase.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Sync error.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset all portfolio content, projects, and skills to the original verified John Yestin F. Cruz defaults? Custom uploads in local storage will be reset.'
      )
    ) {
      DataService.resetToDefaults();
      onRefreshAll();
      showToast('Portfolio restored to initial defaults.', 'info');
    }
  };

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-public-key`;

  const copyEnvTemplate = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-nearBlack">
          Backend Storage & Database Configuration
        </h2>
        <p className="text-xs text-neutralGray mt-1">
          Monitor your database connection, synchronize records, or configure a free Supabase cloud instance.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className={`p-6 rounded-sm border ${
        isSupabaseConfigured
          ? 'bg-white border-blue-200'
          : 'bg-white border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            {isSupabaseConfigured ? (
              <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-nearBlack uppercase tracking-wider">
                  {isSupabaseConfigured ? 'Supabase Cloud Backend Active' : 'Local Persistence Engine Active'}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isSupabaseConfigured ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSupabaseConfigured ? 'ONLINE' : 'LOCAL MODE'}
                </span>
              </div>
              <p className="text-xs text-neutralGray mt-1 max-w-xl">
                {isSupabaseConfigured
                  ? 'All image uploads, project case studies, and profile updates persist securely in your Supabase Postgres database and Storage bucket.'
                  : 'Currently operating with the built-in browser engine. You can fully test all image uploads, case study additions, and edits right now. Connect Supabase to sync across all devices.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider bg-white border border-subtleBorder hover:border-nearBlack text-nearBlack px-3.5 py-2 rounded-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            {isSupabaseConfigured && (
              <button
                onClick={handleSyncToSupabase}
                disabled={syncing}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider bg-nearBlack hover:bg-black text-warmWhite px-3.5 py-2 rounded-sm transition-colors disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{syncing ? 'Syncing...' : 'Sync Local Data'}</span>
              </button>
            )}
          </div>
        </div>

        {testResult && (
          <div className={`mt-4 p-3 rounded-sm border text-xs ${
            testResult.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span className="font-semibold">{testResult.ok ? 'Connection Verified: ' : 'Notice: '}</span>
            {testResult.message}
          </div>
        )}
      </div>

      {/* Step-by-Step Supabase Setup Guide */}
      <div className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-subtleBorder">
          <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack flex items-center space-x-2">
            <Database className="w-4 h-4 text-accentBlue" />
            <span>Beginner Guide: Setting Up Free Supabase Backend</span>
          </h3>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-accentBlue hover:underline inline-flex items-center space-x-1"
          >
            <span>Visit Supabase</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <ol className="space-y-4 text-xs text-nearBlack/85 leading-relaxed list-decimal list-inside">
          <li className="pl-1">
            <strong>Create a Free Supabase Account:</strong> Visit{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-accentBlue underline">
              supabase.com
            </a>{' '}
            and click "Start your project" (100% free tier includes Postgres, Auth, and 1GB file storage).
          </li>

          <li className="pl-1">
            <strong>Execute SQL Schema:</strong> In your Supabase project dashboard, open the{' '}
            <span className="font-mono bg-warmWhite px-1 border border-subtleBorder">SQL Editor</span>, copy the entire contents of{' '}
            <span className="font-mono bg-warmWhite px-1 border border-subtleBorder">supabase/schema.sql</span>, and click{' '}
            <strong>Run</strong>. This creates all tables, policies, and the <span className="font-mono">portfolio-images</span> bucket.
          </li>

          <li className="pl-1">
            <strong>Seed Initial Portfolio Data:</strong> Open a new SQL query tab, paste the contents of{' '}
            <span className="font-mono bg-warmWhite px-1 border border-subtleBorder">supabase/seed.sql</span>, and click <strong>Run</strong>.
          </li>

          <li className="pl-1">
            <strong>Create Admin User:</strong> Navigate to <strong>Authentication &gt; Users</strong> in the Supabase sidebar. Click{' '}
            <strong>Add User &gt; Create User</strong>. Enter your desired administrator email and a strong password. Enable "Auto Confirm User".
          </li>

          <li className="pl-1">
            <strong>Configure Environment Variables:</strong> Go to <strong>Project Settings &gt; API</strong>. Copy your{' '}
            <span className="font-mono">Project URL</span> and <span className="font-mono">anon public key</span> into your local project file named{' '}
            <span className="font-mono bg-warmWhite px-1 border border-subtleBorder">.env</span>:
          </li>
        </ol>

        {/* Environment File Sample */}
        <div className="bg-[#171717] text-[#FAFAF8] p-4 rounded-sm font-mono text-xs relative overflow-x-auto">
          <button
            onClick={copyEnvTemplate}
            className="absolute top-2.5 right-2.5 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] flex items-center space-x-1 transition-colors"
          >
            {copiedEnv ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
          <pre>{envTemplate}</pre>
        </div>
      </div>

      {/* Factory Reset Danger Zone */}
      <div className="bg-white border border-rose-200 p-6 rounded-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <h3 className="text-xs uppercase tracking-wider font-bold text-rose-700 flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Portfolio Defaults</span>
          </h3>
        </div>

        <p className="text-xs text-neutralGray leading-relaxed">
          Restore all portfolio text, project entries (CSLMS, BEDGUARD, Elevator, Shoe Care Vending), competencies, and verified academic details back to John Yestin F. Cruz's official initial baseline.
        </p>

        <div>
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-700 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors"
          >
            Restore Default Baseline
          </button>
        </div>
      </div>

    </div>
  );
};
