require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const User = require('./models/User');
const Todo = require('./models/Todo');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todoapp';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding...');

  const DEFAULT_USERNAME = process.env.SEED_USERNAME || 'owner';
  const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'password123';

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  await User.findOneAndUpdate({ username: DEFAULT_USERNAME }, { username: DEFAULT_USERNAME, passwordHash: hash }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`Seeded user: ${DEFAULT_USERNAME} / ${DEFAULT_PASSWORD} (change these in .env)`);

  const todos = [
    { serial: 1, name: 'Cart Ki safai', time: '11:00 AM' },
    { serial: 2, name: 'Griller Safai', time: '11:00 AM' },
    { serial: 3, name: 'Kitchen Safai', time: '11:00 AM' },
    { serial: 4, name: 'Deep Fridge Safai', time: '12:00 AM' },
    { serial: 5, name: 'Griller Safai', time: '11:00 AM' },
    { serial: 6, name: 'Sauce Pizza box,tissue etc.', time: '11:00 AM' },
    { serial: 7, name: 'Agarbatti * 4', time: '11:00 AM' },
    { serial: 8, name: 'Bartan Dhona', time: '11:00 AM' },
    { serial: 9, name: '2 duster', time: '11:00 AM' },
    { serial: 10, name: 'Soap For Handwash', time: '11:00 AM' },
    { serial: 11, name: 'Rat Trap', time: '11:00 AM' },
    { serial: 12, name: 'Gallery Ki safai', time: '12:00 AM' },
    { serial: 13, name: 'Dough', time: '3:30 AM' },
    { serial: 14, name: 'Gate kei aage ki safai', time: '3:30 AM' },
    { serial: 15, name: 'Dress code', time: '3:30 AM' },
    { serial: 16, name: 'Dustbin safai', time: '3:30 AM' },
    { serial: 17, name: 'Dustbin throw', time: '10:00 pM' },
    { serial: 18, name: 'Cylinder jagah', time: '10:00 PM' },
    { serial: 19, name: 'Griller Unplug', time: '10:00 PM' },
    { serial: 20, name: 'Gate Lock', time: '10:30 PM' },
    // { serial: 14, name: 'Deep Fridge Safai', time: '12:00 AM' },



  ];

  await Todo.deleteMany({});
  await Todo.insertMany(todos);
  console.log('Todos seeded:', todos.length);

  await mongoose.disconnect();
  console.log('Seeding complete.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
