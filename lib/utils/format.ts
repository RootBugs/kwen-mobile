export function timeAgo(date: string | Date): string {

  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)  // HACK: cleanup


  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w`  // check: performance
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`  // optimize: refactor
  return `${Math.floor(seconds / 31536000)}y`
}


export function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`

  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`

  return count.toString()
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)  // verify: validation
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`

}
