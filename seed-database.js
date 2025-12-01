const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// 1. Initialize the Admin SDK (God Mode)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- THE BLUEPRINTS (Data from your Dashboard) ---
const DATA_PROFILES = {
  architect: {
    accounts: [
      { name: 'Trading 212', balance: 145000, type: 'investment', provider: 'Trading 212' },
      { name: 'Coinbase', balance: 42000, type: 'investment', provider: 'Coinbase' },
      { name: 'Amex Platinum', balance: -1200, type: 'liability', provider: 'Amex' },
    ],
    goals: [
      { name: 'Financial Independence', target: 1000000, current: 245000, deadline: '2035-01-01', color: 'indigo' },
    ],
    settings: { persona: 'architect', netWorth: 245000 }
  },
  steward: {
    accounts: [
      { name: 'Main Residence', balance: 850000, type: 'asset', provider: 'Zoopla' },
      { name: 'Family Trust', balance: 400000, type: 'asset', provider: 'Coutts' },
      { name: 'Mortgage', balance: -350000, type: 'liability', provider: 'Barclays' },
    ],
    goals: [
      { name: 'Uni Fund (Leo)', target: 60000, current: 45000, deadline: '2028-09-01', color: 'emerald' },
    ],
    settings: { persona: 'steward', netWorth: 1250000 }
  },
  collaborator: {
    accounts: [
      { name: 'Joint Monzo', balance: 2450, type: 'asset', provider: 'Monzo' },
      { name: 'Joint Savings', balance: 12000, type: 'asset', provider: 'Starling' },
    ],
    goals: [
      { name: 'Wedding', target: 25000, current: 12000, deadline: '2025-06-01', color: 'rose' },
      { name: 'Honeymoon', target: 5000, current: 1500, deadline: '2025-07-01', color: 'amber' },
    ],
    settings: { persona: 'collaborator', netWorth: 42000 }
  },
  // Add some dummy waitlist entries too
  waitlist: [
    { email: 'jane.doe@example.com', name: 'Jane Doe', source: 'hero_form', createdAt: new Date() },
    { email: 'investor@vc.com', name: 'Big Investor', source: 'demo_exit', createdAt: new Date() }
  ]
};

async function seedDatabase() {
  console.log('🚀 Starting Database Construction...');

  // 1. Create User Profiles (Architect, Steward, etc.)
  for (const [key, profile] of Object.entries(DATA_PROFILES)) {
    if (key === 'waitlist') continue;

    console.log(`Building Persona: ${key.toUpperCase()}...`);

    // Create the User Document
    const userRef = db.collection('users').doc(key);
    await userRef.set({
      ...profile.settings,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create Sub-Collection: Accounts
    const accountsBatch = db.batch();
    profile.accounts.forEach(acc => {
      const docRef = userRef.collection('accounts').doc(); // Auto-ID
      accountsBatch.set(docRef, acc);
    });
    await accountsBatch.commit();
    console.log(` - Added ${profile.accounts.length} accounts.`);

    // Create Sub-Collection: Goals
    const goalsBatch = db.batch();
    profile.goals.forEach(goal => {
      const docRef = userRef.collection('goals').doc();
      goalsBatch.set(docRef, goal);
    });
    await goalsBatch.commit();
    console.log(` - Added ${profile.goals.length} goals.`);
  }

  // 2. Populate Waitlist
  console.log('Populating Waitlist...');
  const waitlistBatch = db.batch();
  DATA_PROFILES.waitlist.forEach(entry => {
    const docRef = db.collection('waitlist').doc();
    waitlistBatch.set(docRef, entry);
  });
  await waitlistBatch.commit();

  console.log('✅ Database Construction Complete. Nest is live.');
}

seedDatabase().catch(console.error);