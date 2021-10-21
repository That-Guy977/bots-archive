export default function updatePresence(client) {
  client.getMember(client.data.alternate).then((m) => {
    const active = (m.presence?.status ?? 'offline') === 'offline'
    if (active !== client.state.active) client.user.setStatus(active ? 'online' : 'idle')
    client.state.active = active
  }).catch(() => console.log(`Failed to fetch presence of ${client.data.alternate}`))
}
