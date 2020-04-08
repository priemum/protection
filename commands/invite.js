module.exports = {
    name: "invite",
    alias: ["add"],
    run: async function(client, message) {
      message.react("✅")
        message.author.send("https://discordapp.com/oauth2/authorize?client_id="+client.user.id+"&scope=bot&permissions=268577972")
    }
}