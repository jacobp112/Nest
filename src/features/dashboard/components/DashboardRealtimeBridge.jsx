import { useDashboardRealtime } from '../hooks/useDashboardRealtime';

const defaultDashboardSnapshot = {
  metrics: [],
  updatedAt: null,
};

export default function DashboardRealtimeBridge() {
  useDashboardRealtime({
    queryKey: ['dashboard', 'snapshot'],
    endpoint: process.env.REACT_APP_REALTIME_URL,
    applyIncoming: (incoming, previous = defaultDashboardSnapshot) => {
      if (!incoming) return previous;
      const nextMetrics = previous.metrics.some((metric) => metric.id === incoming.id)
        ? previous.metrics.map((metric) =>
            metric.id === incoming.id ? { ...metric, ...incoming } : metric,
          )
        : [...previous.metrics, incoming];

      return {
        ...previous,
        metrics: nextMetrics,
        updatedAt: incoming.updatedAt ?? new Date().toISOString(),
      };
    },
  });

  return null;
}
