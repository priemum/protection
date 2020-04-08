module.exports = {
    name: "whitelist",
    alias: ["wl", "allow"],
    run: async function(client, message) {
      let args = message.content.split(" ").slice(1).join(" ");
      let user = message.mentions.users.first() || await client.fetchUser(message.content.split(" ")[2]);
      if (
            !client.owners.includes(message.author.id) )
        if(
            message.guild.ownerID != message.author.id
          )
          
            return message.channel.send(":x: **Only owner can use that!**");  
      if (!client.con[message.guild.id].whitelist)
        client.con[message.guild.id].whitelist = [];
      if (!args && !user) {
        return message.channel.send(`:page_facing_up: **Current Whitelist.
\`${
        client.con[message.guild.id].whitelist.map(cowner =>
          client.users.get(cowner)
            ? client.users.get(cowner).username
            : "Unknown User"
        ).join("\n") }\`**`);
      }
      if (!user)
        return message.channel.send(
          `:x: **Usage: ${client.prefix}whitelist [add/remove] <@user/@bot>**`
        );

      if (args.startsWith("add")) {
        if (client.con[message.guild.id].whitelist.includes(user.id))
          return message.channel.send(
            ":x: **This user is already on the list**"
          );
        client.con[message.guild.id].whitelist.push(user.id);
        return message.channel.send(
          "**:white_check_mark: Done `" +
            client.con[message.guild.id].whitelist.map(cowner =>
              client.users.get(cowner)
                ? client.users.get(cowner).username
                : "Unknown User"
            ) +
            "`**"
        );
      } else if (args.startsWith("remove")) {
        if (!client.con[message.guild.id].whitelist.includes(user.id))
          return message.channel.send(":x: **This user is not on the list**");
        const index = client.con[message.guild.id].whitelist.indexOf(user.id);
        if (index > -1) {
          client.con[message.guild.id].whitelist.splice(index, 1);
        }
        return message.channel.send(
          "**:white_check_mark: Done `" +
            client.con[message.guild.id].whitelist.map(cowner =>
              client.users.get(cowner)
                ? client.users.get(cowner).username
                : "Unknown User"
            ) +
            "`**"
        );
      }
      client.fs.writeFile("./config.json", JSON.stringify(client.con, null, 2), function(e) {
        if (e) throw e;
      });
    }  
}