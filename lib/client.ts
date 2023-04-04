export type HighstormEvent = {
  /**
   * Unix timestamp with millisecond precision of when the event happened
   *
   * @default Date.now()
   */
  time?: number
  /**
   * The title of the event
   */
  event: string
  /**
   * Optional content
   */
  content?: string

  /**
   * Optional key-value metadata
   */
  metadata?: Record<string, string | number | boolean | null>
}

export async function highstorm(
  channel: string,
  event: HighstormEvent,
  token?: string
): Promise<{ id: string }> {
  token ??= process.env.HIGHSTORM_TOKEN
  if (!token) {
    throw new Error(
      "Either provide a token, or set the `HIGHSTORM_TOKEN` env variable"
    )
  }

  const res = await fetch(
    `https://highstorm.vercel.app/api/v1/events/${channel}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    }
  )
  if (!res.ok) {
    throw new Error(`Unable to ingest event: ${await res.text()}`)
  }
  return await res.json()
}