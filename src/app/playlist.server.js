import type { NextApiRequest, NextApiResponse } from 'next'

export const playlistServerAction = async (req: NextApiRequest, res: NextApiResponse) => {
  // Logica van je API-route hier
  const playlists = await getPlaylists()
  return res.json(playlists)
}
