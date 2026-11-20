import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 32, text = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
    }}>
      <Loader2
        size={size}
        style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }}
      />
      {text && (
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{text}</span>
      )}
    </div>
  );
}
