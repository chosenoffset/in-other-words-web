import axios from 'axios'

export async function convertAnonymousAttempts(token: string): Promise<void> {
  const fingerprint = localStorage.getItem('puzzleFingerprint')
  if (!fingerprint) {
    return
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/app/attempts/convert-attempts`,
      { userFingerprint: fingerprint },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // Clear fingerprint after successful conversion
    localStorage.removeItem('puzzleFingerprint')
  } catch (error) {
    console.error('Failed to convert anonymous attempts:', error)
    // Don't throw - this is not critical to user experience
  }
}
