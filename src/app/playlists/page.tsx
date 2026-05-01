// src/app/playlists/page.tsx
import { auth } from "@/auth"

export default async function PlaylistsPage() {
  const session = await auth()

  if (!session)
    return <p>Je bent niet ingelogd.</p>

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welkom, {session.user?.name}</h1>
      <p>Je bent succesvol ingelogd met Google.</p>
    </div>
  )
}
