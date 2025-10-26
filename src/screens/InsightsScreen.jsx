import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import BarChart from '../components/charts/BarChart';
import BottomTabBar from '../components/BottomTabBar';
import Button from '../components/Button';

export default function InsightsScreen({ navigate = () => {} }) {
  const topCategories = [
    { label: 'Food', value: 420 },
    { label: 'Transport', value: 210 },
    { label: 'Subscriptions', value: 180 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="Insights" />
      <main className="p-4 flex flex-col gap-4">
        <Card>
          <div>
            <div className="text-sm font-semibold text-text-primary">Spending Summary</div>
            <div className="mt-2 text-sm text-text-secondary">You're spending 12% less than last month</div>
          </div>
        </Card>

        <Card>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-text-primary">Top Spending</div>
              <Button title="View All Categories" variant="tertiary" onPress={() => navigate('SpendingDetails')} />
            </div>
            <div className="mt-3">
              <BarChart data={topCategories} />
            </div>
          </div>
        </Card>

        <Card title="Subscriptions">
          <div className="text-sm text-text-primary">
            <div>Spotify • $9.99 • Monthly</div>
            <div>Netflix • $14.99 • Monthly</div>
          </div>
        </Card>
      </main>

      <div className="mt-auto">
        <BottomTabBar active="Insights" onChange={(k) => navigate(k)} />
      </div>
    </div>
  );
}
