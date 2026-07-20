import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const cloudEnabled = Boolean(url && anonKey)
export const supabase = cloudEnabled ? createClient(url, anonKey) : null
export const CLASS_ID = import.meta.env.VITE_CLASS_ID || 'kelas-5b-sdn-satria-jaya-01'

export async function loadCloudData() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('class_app_data')
    .select('payload,updated_at')
    .eq('class_id', CLASS_ID)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveCloudData(payload) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('class_app_data')
    .upsert({ class_id: CLASS_ID, payload, updated_at: new Date().toISOString() }, { onConflict: 'class_id' })
    .select('updated_at')
    .single()
  if (error) throw error
  return data
}

export function subscribeCloudData(onPayload) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel(`class-app-${CLASS_ID}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'class_app_data', filter: `class_id=eq.${CLASS_ID}`
    }, event => {
      if (event.new?.payload) onPayload(event.new.payload, event.new.updated_at)
    })
    .subscribe()
  return () => supabase.removeChannel(channel)
}
