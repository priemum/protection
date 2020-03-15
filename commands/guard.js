module.exports = {
    name: "guard",
    alias: ["prot", "set"],
    run: function(client, message) {
        let meth = message.content.split(" ")[1];
        let args = message.content.split(" ").slice(2).join(" ");
      if (
            !client.owners.includes(message.author.id) ||
            !message.guild.ownerID == message.author.id
          )
          
            return message.channel.send(":x: **Only owner can use that!**");      
      if (meth == "members") {
        if (!args) return message.channel.send("**:x: Specify an amount ! **");
        if (isNaN(args)) return message.channel.send("**:x: Only numbers !**");
        client.con[message.guild.id].members = args;
        message.channel.send(
          `**:white_check_mark: Ban limits has changed to : \`${client.con[message.guild.id].members}\`**`
        );
      }

      if (meth == "roles") {
        if (!args) return message.channel.send("**:x: Specify an amount ! **");
        if (isNaN(args)) return message.channel.send("**:x: Only numbers ! **");
        client.con[message.guild.id].roles = args;
        message.channel.send(
          `**:white_check_mark: Role Delete limits has changed to : \`${client.con[message.guild.id].roles}\`**`
        );
      }
      if (meth == "channels") {
        if (!args) return message.channel.send("**:x: Specify an amount ! **");
        if (isNaN(args)) return message.channel.send("**:x: Only numbers ! **");
        client.con[message.guild.id].channels = args;
        message.channel.send(
          `**:white_check_mark: Channel Delete limits has changed to : \`${client.con[message.guild.id].channels}\`:**`
        );
      }
      if (meth == "time") {
        if (!args) return message.channel.send("**:x: Specify an amount ! **");
        if (isNaN(args)) return message.channel.send("**:x: Only numbers ! **");
        client.con[message.guild.id].time = args;
        message.channel.send(
          `**:white_check_mark: time has changed to : \`${client.con[message.guild.id].time}\`**`
        );
      }
      if (meth == "data") {
        message.channel.send(`**\`${message.guild.name}\` Data:
:shield: Limits (in ${client.con[message.guild.id].time} seconds):
      Members: \`${client.con[message.guild.id].members}\`
      Channels: \`${client.con[message.guild.id].channels}\`
      Roles: \`${client.con[message.guild.id].roles}\`
      Whitelist: \`${
      client.con[message.guild.id].whitelist.map(cowner =>
        client.users.get(cowner)
                                                 
          ? client.users.get(cowner).username
          : "Unknown User"
      )}\`**`);
      }
      client.fs.writeFile("./config.json", JSON.stringify(client.con, null, 2), function(e) {
        if (e) throw e;
      });
    }
}