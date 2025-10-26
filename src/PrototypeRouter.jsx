import React, { useState } from 'react';
import DashboardScreen from './screens/DashboardScreen.jsx';
import MoneyScreen from './screens/MoneyScreen.jsx';
import AccountListScreen from './screens/AccountListScreen.jsx';
import InsightsScreen from './screens/InsightsScreen.jsx';
import GoalsScreen from './screens/GoalsScreen.jsx';

export default function PrototypeRouter() {
  const [route, setRoute] = useState({ name: 'Dashboard', params: {} });

  const navigate = (name, params = {}) => {
    setRoute({ name, params });
  };

  const goBack = () => {
    // simplistic: always go back to Dashboard
    setRoute({ name: 'Dashboard', params: {} });
  };

  const render = () => {
    switch (route.name) {
      case 'Dashboard':
        return <DashboardScreen navigate={navigate} />;
      case 'Money':
        return <MoneyScreen navigate={navigate} />;
      case 'AccountList':
        return <AccountListScreen categoryName={route.params.categoryName || 'Accounts'} accounts={route.params.accounts || []} navigate={navigate} />;
      case 'Insights':
        return <InsightsScreen navigate={navigate} />;
      case 'Goals':
        return <GoalsScreen navigate={navigate} />;
      default:
        return <DashboardScreen navigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ padding: 8, background: '#fff', borderBottom: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={goBack} style={{ padding: 8 }}>Back</button>
        <div style={{ fontWeight: 700 }}>Prototype Router — {route.name}</div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>Open with ?prototype=1 to view</div>
      </div>
      {render()}
    </div>
  );
}
