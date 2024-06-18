// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'User',
      email: 'user@nextmail.com',
      password: '123456',
    },
    {
      id: '2eafca0e-8a0d-4d1b-9d89-2f3c9fa1a57e', // New admin user
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword', // Replace with a hashed password
    },
];

const cases = [
    {
      id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
      name: 'Case 1',
      user_id: '410544b2-4001-4271-9855-fec4b6a6442a', // User assigned to this case
    },
];

const identifiers = [
    {
      id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c65',
      case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
      type: 'email',
      query: 'bob@gmail.com',
    },
    {
      id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c66',
      case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
      type: 'phone',
      query: 'stan@gmail.com',
    },
];

module.exports = {
  users,
  cases,
  identifiers,
};
