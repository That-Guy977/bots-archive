function updatePremium(client) {
  const { premiumSubscriptionCount, premiumTier } = client.guild
  client.state.premium = { premiumSubscriptionCount, premiumTier }
}

module.exports = updatePremium
