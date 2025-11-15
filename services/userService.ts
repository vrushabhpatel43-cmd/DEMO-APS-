import type { User } from '../types';

// Mock user database. In a real application, this would be a call to a backend API.
export const users: User[] = [
  { email: 'manager@estoarkis.com', name: 'Admin Manager', role: 'manager' },
  { email: 'john.doe@estoarkis.com', name: 'John Doe', role: 'telecaller' },
  { email: 'jane.smith@estoarkis.com', name: 'Jane Smith', role: 'telecaller' },
];

/**
 * Finds a user by their email address (case-insensitive).
 * @param email The email to search for.
 * @returns The User object if found, otherwise undefined.
 */
export const findUserByEmail = (email: string): User | undefined => {
  if (!email) return undefined;
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};