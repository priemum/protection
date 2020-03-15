module.exports = {
    name: "ping",
    alias: ["latency"],
    run: async function(client, message) {
        let shard = client.ping;
        let msg = await message.channel.send(`**Ping**: \`...\``);
        let ping = Math.floor(msg.createdTimestamp - message.createdTimestamp);
        await msg.edit(
            `:ping_pong: **Ping**: \`${ping}\`ms | **Websocket**: \`${Math.floor(
            shard
            )}\`ms`
        );
    }
}