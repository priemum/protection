module.exports = {
    name: "help",
    alias: ["cmds", "commands"],
    run: function(client, message) {
        message.channel.send(`**Bot Commands:**

**\`${client.prefix}guard <on/of>\` Turn On/Off the protection**

**\`${client.prefix}guard <members/roles/channels>\` changes the limit of diiffrent actions in \`${client.con[message.guild.id].time}\` seconds.**

**\`${client.prefix}guard time\` change the time limit.**

**\`${client.prefix}antibots [on/off]\` Allow/Block bots from joining your server**

**\`${client.prefix}whitelist [add/remove] [@user/@bot]\` allow users/bots to cross limits**

**\`${client.prefix}bot\` Shows owner commands.**

\`<> is required and [] is optional\`
\`\`\`For more information or help use ${client.prefix}about \`\``);
    }
}