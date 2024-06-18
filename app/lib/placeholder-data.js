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
  {
    id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c67',
    case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
    type: 'username',
    query: 'user123',
  },
  {
    id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c68',
    case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
    type: 'fullname',
    query: 'Bob Stan',
  },
  {
    id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c69',
    case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
    type: 'socialurl',
    query: 'https://twitter.com/bobstan',
  },
  {
    id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c70',
    case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
    type: 'telegramid',
    query: '@bobstan',
  },
  {
    id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c71',
    case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
    type: 'reverseimage',
    query: 'https://example.com/image.jpg',
  },
  {
    id: '6a44a75d-9cb4-4c25-8b7e-fbc6e70c3c72',
    case_id: '5b8f33c2-d4c8-4df5-9b72-c73c0e2cddf5',
    type: 'facename',
    query: 'Bob Stan',
  },
];

module.exports = {
  users,
  cases,
  identifiers,
};
