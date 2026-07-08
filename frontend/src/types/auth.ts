export type AuthRole = 'executive' | 'manager' | 'operator';

export interface AuthUser {
  id: string;
  name: string;
  role: AuthRole;
  identifier: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}