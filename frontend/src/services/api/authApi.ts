import { simulateLatency } from './client';
import { currentUser } from '../../data/users';

// POST /v1/auth/login
export async function login(_email: string, _password: string) {
  return simulateLatency({ user: currentUser, token: 'mock-token' }, 900);
}

// POST /v1/auth/signup
export async function signup(_name: string, _email: string, _password: string) {
  return simulateLatency({ user: { ...currentUser, name: _name, email: _email }, token: 'mock-token' }, 900);
}

// POST /v1/auth/forgot-password
export async function forgotPassword(_email: string) {
  return simulateLatency({ success: true }, 900);
}
