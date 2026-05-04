// Supabase has been removed. This file is a stub to prevent import errors
// during the transition. All data now goes through /api/* routes.
export function createClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => {},
      signInWithOtp: async () => ({ error: new Error('Auth not available') }),
      verifyOtp: async () => ({ data: { session: null, user: null }, error: new Error('Auth not available') }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
    }),
  } as any;
}
