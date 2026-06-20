import { CONFIG } from '@/constants/config';

import { RestApiAdapter } from './adapters/RestApiAdapter';
import type { AuthAdapter } from './adapters/types';

let _adapter: AuthAdapter | null = null;

/**
 * Returns the singleton auth adapter.
 *
 * To swap adapters, replace the body of this function:
 *   import { SupabaseAdapter } from './adapters/SupabaseAdapter';
 *   return new SupabaseAdapter({ supabaseUrl: CONFIG.SUPABASE_URL, supabaseAnonKey: CONFIG.SUPABASE_ANON_KEY });
 */
export function getAuthAdapter(): AuthAdapter {
  if (!_adapter) {
    _adapter = new RestApiAdapter({
      baseUrl: CONFIG.AUTH_BASE_URL,
    });
  }
  return _adapter;
}

export type { AuthAdapter } from './adapters/types';
