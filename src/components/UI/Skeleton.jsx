import { useEffect, useState } from 'react';

export function Skeleton({ width = '100%', height = 20, style = {}, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-kpi-row">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-kpi-card">
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={28} style={{ marginTop: 8 }} />
            <Skeleton width="80%" height={12} style={{ marginTop: 6 }} />
          </div>
        ))}
      </div>
      <div className="skeleton-table">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton-row">
            <Skeleton width="120px" height={16} />
            <Skeleton width="200px" height={16} />
            <Skeleton width="80px" height={16} />
            <Skeleton width="80px" height={16} />
            <Skeleton width="80px" height={16} />
            <Skeleton width="100px" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function useLoadingDelay(ms = 1200) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return show;
}
