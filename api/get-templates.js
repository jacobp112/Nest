const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = path.join(process.cwd(), 'src', 'email-templates');

const METADATA = {
  'waitlist-welcome': {
    name: 'Waitlist: Welcome',
    desc: 'Sent immediately after sign-up.',
  },
  'launch-invite': {
    name: 'Onboarding: Launch Invite',
    desc: 'Sent when users move from waitlist to an active onboarding wave.',
  },
  'subscription-alert': {
    name: 'Billing: Subscription Alert',
    desc: 'Sent when subscription or billing requires attention.',
  },
};

const getTemplates = () => {
  const files = fs.readdirSync(TEMPLATE_DIR).filter((file) => file.endsWith('.html'));

  return files.map((file) => {
    const id = path.basename(file, '.html');
    const html = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');
    const meta = METADATA[id] || {};

    return {
      id,
      name: meta.name || id,
      desc: meta.desc || '',
      html,
    };
  });
};

module.exports = async (req, res) => {
  if (req.method && req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end('Method Not Allowed');
    return;
  }

  try {
    const templates = getTemplates();
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to load email templates', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to load email templates' }));
  }
};
