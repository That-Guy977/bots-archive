export default function updatePremium(client) {
  const { premiumSubscriptionCount, premiumTier } = client.guild
  client.state.premium = { premiumSubscriptionCount, premiumTier }
}
