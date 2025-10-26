import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import BottomTabBar from '../components/BottomTabBar';
import Button from '../components/Button';
import LineChart from '../components/charts/LineChart';

export default function DashboardScreen({ navigate = () => {} }) {
  // placeholder/mock data
  const netWorthData = [
    { x: 'Jan', y: 10000 },
    { x: 'Feb', y: 11000 },
    { x: 'Mar', y: 12000 },
    { x: 'Apr', y: 11800 },
    { x: 'May', y: 12500 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Dashboard" rightAction={{ icon: '⚙️', onPress: () => navigate('Settings') }} />
      <main className="p-4 flex flex-col gap-4">
        <Card onPress={() => navigate('Money')}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-text-primary">Net Worth</div>
              <div className="text-2xl font-bold text-text-primary">$12,500</div>
            </div>
            <div className="w-56">
              <LineChart data={netWorthData} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-text-primary">Cash Flow</div>
              <div className="text-sm text-[--semantic-success]">+ $2,400</div>
            </div>
            <Button title="View Details" variant="tertiary" onPress={() => navigate('Insights')} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-text-primary">Budget</div>
              <div className="text-sm text-text-secondary">You are on track</div>
            </div>
            <Button title="Manage" variant="secondary" onPress={() => navigate('Budgets')} />
          </div>
        </Card>

        <Card onPress={() => navigate('Goals')}>
          <div>
            <div className="text-sm font-semibold text-text-primary">Top Goal</div>
            <div className="mt-2 text-sm text-text-secondary">Vacation • 42% complete</div>
          </div>
        </Card>
      </main>

      <div className="mt-auto">
        <BottomTabBar active="Dashboard" onChange={(k) => navigate(k)} />
      </div>
    </div>
  );
}
