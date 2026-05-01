// src/app/playlists/page.tsx
import { cookies } from "next/headers"

export default async function PlaylistsPage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get("admin_logged_in")?.value === "true"

  if (!isLoggedIn)
    return <p>Je bent niet ingelogd.</p>

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welkom</h1>
      <p>Je bent succesvol ingelogd.</p>
    </div>
  )
}
