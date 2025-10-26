import React from 'react';
import Header from '../components/Header';
import Accordion from '../components/Accordion';
import ListItem from '../components/ListItem';
import LineChart from '../components/charts/LineChart';
import BottomTabBar from '../components/BottomTabBar';

export default function MoneyScreen({ navigate = () => {} }) {
  const netWorthHistory = [
    { x: 'Jan', y: 9000 },
    { x: 'Feb', y: 10000 },
    { x: 'Mar', y: 11500 },
    { x: 'Apr', y: 12000 },
  ];

  const assetCategories = [{ id: 'cash', title: 'Cash', subtitle: '3 accounts' }, { id: 'invest', title: 'Investments', subtitle: '2 accounts' }];
  const liabilityCategories = [{ id: 'loan', title: 'Loans', subtitle: '1 account' }];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="Your Money" />
      <main className="p-4">
        <div className="mb-4">
          <LineChart data={netWorthHistory} />
        </div>

        <Accordion title="Assets" totalAmount="$21,200">
          {assetCategories.map((c) => (
            <ListItem key={c.id} title={c.title} subtitle={c.subtitle} onPress={() => navigate('AccountList', { categoryId: c.id })} showChevron />
          ))}
        </Accordion>

        <Accordion title="Liabilities" totalAmount="$3,200">
          {liabilityCategories.map((c) => (
            <ListItem key={c.id} title={c.title} subtitle={c.subtitle} onPress={() => navigate('AccountList', { categoryId: c.id })} showChevron />
          ))}
        </Accordion>
      </main>

      <div className="mt-auto">
        <BottomTabBar active="Money" onChange={(k) => navigate(k)} />
      </div>
    </div>
  );
}
