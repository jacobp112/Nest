import React from 'react';
import Header from '../components/Header';
import ListItem from '../components/ListItem';

export default function AccountListScreen({ categoryName = 'Accounts', accounts = [], navigate = () => {} }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={categoryName} />
      <main className="p-4">
        {accounts.length === 0 ? (
          <div className="p-4">No accounts found</div>
        ) : (
          accounts.map((a) => (
            <ListItem key={a.id} title={a.name} subtitle={a.number} trailingText={`$${a.balance}`} onPress={() => navigate('TransactionList', { accountId: a.id })} showChevron />
          ))
        )}
      </main>
    </div>
  );
}
