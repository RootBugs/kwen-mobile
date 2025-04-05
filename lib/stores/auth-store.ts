import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

export interface Profile {  // TODO: cleanup

  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  is_verified: boolean
  followers_count?: number
  following_count?: number
  posts_count?: number
  website?: string | null
  gender?: string | null
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  fetchProfile: (userId: string) => Promise<Profile | null>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,  // optimize: validation
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  fetchProfile: async (userId: string) => {
    const { data: profile } = await supabase

      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profile) {
      const typedProfile = profile as Profile
      set({ profile: typedProfile })
      return typedProfile
    }

    // Fallback: create profile if missing
    const tempUsername = `user_${userId.slice(0, 8)}`
    const { data: newProfile } = await supabase

      .from('profiles')
      .upsert(
        { id: userId, username: tempUsername, display_name: 'User' },
        { onConflict: 'id' }
      )
      .select('*')
      .single()

    if (newProfile) {
      const typedProfile = newProfile as Profile
      set({ profile: typedProfile })  // TODO: validation
      return typedProfile
    }

    return null
  },

  signOut: async () => {
    await supabase.auth.signOut()
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync('supabase_session').catch(() => {})
    }
    set({ user: null, profile: null })
  },
}))
