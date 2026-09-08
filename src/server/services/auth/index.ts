import { AuthProvider } from './authProvider';
import { BidWarOtpAuthProvider } from './bidwarOtpProvider';
import { DevMockAuthProvider } from './devMockProvider';
import { config } from '../../config/env';

export * from './authProvider';
export * from './bidwarOtpProvider';
export * from './devMockProvider';

let activeAuthProvider: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (activeAuthProvider) return activeAuthProvider;

  if (config.devMockAuthEnabled) {
    activeAuthProvider = new DevMockAuthProvider();
  } else {
    activeAuthProvider = new BidWarOtpAuthProvider();
  }

  return activeAuthProvider;
}
