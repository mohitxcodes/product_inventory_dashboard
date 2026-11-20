export default function Badge({ children, variant = 'default', size = 'md' }) {
  const styles = {
    default: {
      background: 'var(--bg-hover)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
    success: {
      background: 'var(--success-dim)',
      color: 'var(--success)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
    },
    warning: {
      background: 'var(--warning-dim)',
      color: 'var(--warning)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
    },
    danger: {
      background: 'var(--danger-dim)',
      color: 'var(--danger)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
    },
    accent: {
      background: 'var(--accent-dim)',
      color: 'var(--accent-light)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
    },
  };

  const sizeStyles = {
    sm: { padding: '0.125rem 0.5rem', fontSize: '0.6875rem' },
    md: { padding: '0.25rem 0.625rem', fontSize: '0.75rem' },
    lg: { padding: '0.375rem 0.75rem', fontSize: '0.8125rem' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '6px',
        fontWeight: 550,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        ...styles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
}
