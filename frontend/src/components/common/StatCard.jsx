import { useEffect, useRef, useState } from 'react';
import './StatCard.css';

function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target == null || isNaN(target)) return;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function StatCard({ icon: Icon, label, value, color, prefix = '', suffix = '' }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const animated = useAnimatedCounter(numericValue);
  const iconBg = `${color}22`;

  return (
    <div className="stat-card" style={{ '--stat-color': color, '--icon-bg': iconBg, '--icon-color': color }}>
      <div className="stat-card-icon">
        {Icon && <Icon size={22} />}
      </div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">
          {prefix}{animated.toLocaleString()}{suffix}
        </div>
      </div>
    </div>
  );
}
