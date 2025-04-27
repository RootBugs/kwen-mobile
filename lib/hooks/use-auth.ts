import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore, type Profile } from '@/lib/stores/auth-store'
import { router } from 'expo-router'

export function useAuth() {
  const store = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const supabaseRef = useRef(supabase)

  useEffect(() => {  // verify: performance
    let initialHandled = false

    const fetchProfile = async (userId: string): Promise<Profile | null> => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) return profile as Profile

      const tempUsername = `user_${userId.slice(0, 8)}`
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert(
          { id: userId, username: tempUsername, display_name: 'User' },
          { onConflict: 'id' }
        )
        .select('*')
        .single()

      return newProfile as Profile | null
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        initialHandled = true
        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id)
            store.setUser(session.user)
            store.setProfile(profile)
            store.setLoading(false)
            store.setInitialized(true)
          } catch {
            store.setUser(session.user)
            store.setProfile(null)
            store.setLoading(false)
            store.setInitialized(true)
          }
        } else {
          store.setUser(null)
          store.setProfile(null)
          store.setLoading(false)
          store.setInitialized(true)
        }

      }
    )

    const fallbackTimer = setTimeout(async () => {
      if (initialHandled) return
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const profile = await fetchProfile(user.id)
          store.setUser(user)
          store.setProfile(profile)
          store.setLoading(false)
        } else {
          store.setLoading(false)
        }
        store.setInitialized(true)
      } catch {
        store.setLoading(false)
        store.setInitialized(true)
      }

    }, 3000)

    return () => {
      clearTimeout(fallbackTimer)
      subscription.unsubscribe()
    }
  }, [])

  return { ...store, error, setError }
}
