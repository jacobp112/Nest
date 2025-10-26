import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Card from '../components/Card';
import BottomTabBar from '../components/BottomTabBar';

export default function GoalsScreen({ navigate = () => {} }) {
  const goals = [
    { id: 'g1', name: 'Vacation', progress: 42, target: 2000 },
    { id: 'g2', name: 'Emergency Fund', progress: 60, target: 5000 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="Your Goals" />
      <main className="p-4 flex flex-col gap-3">
        <Button title="Create New Goal" variant="primary" onPress={() => navigate('CreateGoal')} />

        {goals.map((g) => (
          <Card key={g.id} onPress={() => navigate('GoalDetail', { goalId: g.id })}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-text-primary">{g.name}</div>
                <div className="text-sm text-text-secondary">{g.progress}% of ${g.target}</div>
              </div>
              <div className="text-text-primary">{g.progress}%</div>
            </div>
          </Card>
        ))}
      </main>

      <div className="mt-auto">
        <BottomTabBar active="Goals" onChange={(k) => navigate(k)} />
      </div>
    </div>
  );
}
