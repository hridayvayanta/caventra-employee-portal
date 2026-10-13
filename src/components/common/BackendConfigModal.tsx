import React, { useState } from 'react';
import { X, Server, Database, ShieldAlert, Check, RefreshCw, Download } from 'lucide-react';
import { storageService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset?: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  const existingConfig = storageService.getBackendConfig();
  const [apiUrl, setApiUrl] = useState(existingConfig?.apiUrl || '');
  const [apiKey, setApiKey] = useState(existingConfig?.apiKey || '');
  const toast = useToast();

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiUrl && apiKey) {
      storageService.setBackendConfig({ apiUrl: apiUrl.trim(), apiKey: apiKey.trim() });
      toast.success('Backend configuration saved. Using remote managed API endpoint.');
    } else {
      storageService.setBackendConfig(null);
      toast.info('Reverted to Browser Evaluation / Demo Storage mode.');
    }
    onClose();
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo employees, tasks, and activity logs to original seed state?')) {
      storageService.resetToDefaults();
      toast.success('Demo environment reset to initial Caventra data.');
      if (onDataReset) onDataReset();
      onClose();
    }
  };

  const handleExportBackup = () => {
    const data = storageService.exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caventra-portal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Portal data backup exported.');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-large"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="backend-modal-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--gold-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
              }}
            >
              <Server size={18} />
            </div>
            <div>
              <h3 id="backend-modal-title" style={{ fontSize: 18 }}>
                Backend Integration &amp; Architecture
              </h3>
              <p style={{ fontSize: 12, color: 'var(--tx-muted)', margin: 0 }}>
                GitHub Pages Static Deployment &amp; Managed API Bridge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--tx-muted)',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Architecture Information Box */}
          <div
            style={{
              background: 'rgba(201, 184, 160, 0.05)',
              border: '1px solid var(--gold-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-light)', marginBottom: 6 }}>
              <ShieldAlert size={16} />
              <strong style={{ fontSize: 13.5 }}>Static Hosting Architecture Disclosure</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--tx-muted)', lineHeight: 1.6, margin: 0 }}>
              This portal is engineered to run as a static Single Page Application for instant deployment via <strong>GitHub Pages</strong>. GitHub Pages alone cannot execute server-side authentication, private row-level security, or background cron triggers. When unconfigured, the portal operates in <strong>Client-Side Evaluation Mode</strong> with sandboxed demo storage. To connect your production Caventra database, specify your managed authentication endpoint (e.g., Supabase / Node.js API) below.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="api-endpoint">
                Managed API Endpoint URL (Optional)
              </label>
              <input
                id="api-endpoint"
                type="url"
                className="form-control"
                placeholder="https://xyzcompany.supabase.co/rest/v1 or https://api.caventra.internal"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <span style={{ fontSize: 11.5, color: 'var(--tx-muted)' }}>
                Leave empty to run in fully self-contained Browser Evaluation Mode.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="api-key">
                Public API Anon Key / Auth Header (Optional)
              </label>
              <input
                id="api-key"
                type="password"
                className="form-control"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button type="submit" className="btn btn-solid btn-sm">
                <Check size={14} />
                Save Configuration
              </button>
              {existingConfig && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setApiUrl('');
                    setApiKey('');
                    storageService.setBackendConfig(null);
                    toast.info('Reset back to browser demo mode.');
                    onClose();
                  }}
                >
                  Clear &amp; Revert to Demo Mode
                </button>
              )}
            </div>
          </form>

          {/* Demo Data Management */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            <h4 style={{ fontSize: 14, color: 'var(--tx)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={16} color="var(--gold)" />
              Demo Data Operations
            </h4>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetDemoData}>
                <RefreshCw size={14} />
                Reset Demo Data to Factory Defaults
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportBackup}>
                <Download size={14} />
                Export Data Backup (.json)
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
