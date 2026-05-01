'use server'

// hier komt jouw bestaande serverlogica voor playlists
export async function getPlaylists() {
	// voorbeeld-data (later vervang je dit door YouTube-API-aanroep)
	const playlists = [
		{ id: '1', title: 'Favorieten' },
		{ id: '2', title: 'Klassiekers' },
	]
	return playlists
}