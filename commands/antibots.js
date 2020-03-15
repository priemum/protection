module.exports = {
    name: "antibots",
    alias: ["ab", "antib"],
    run: function(client, message) {
        let args = message.content
        .split(" ")
        .slice(1)
        .join(" ")
        .toLowerCase();
        if (
          !client.owners.includes(message.author.id) ||
          !message.guild.ownerID == message.author.id
        )
          return message.channel.send(":x: **Only owner can use that!**");
        if (!client.con[message.guild.id].bots) client.con[message.guild.id].bots = "on";
        if (!args || !["on", "off"].includes(args))
          return message.channel.send(
            (client.con[message.guild.id].toggle == "on"
              ? ":white_check_mark:"
              : ":warning:") +
              " **AntiBots is `" +
              client.con[message.guild.id].bots.charAt(0).toUpperCase() +
              client.con[message.guild.id].bots.substring(1) +
              "`**"
          );
        if (client.con[message.guild.id].bots == args)
          return message.channel.send(
            ":x: **AntiBots is already `" +
              args.charAt(0).toUpperCase() +
              args.substring(1) +
              "`**"
          );
        client.con[message.guild.id].bots = args;
        message.channel.send(
          (client.con[message.guild.id].bots == "on"
            ? ":white_check_mark:"
            : ":warning:") +
            " **AntiBots Has Turned " +
            client.con[message.guild.id].bots.charAt(0).toUpperCase() +
            client.con[message.guild.id].bots.substring(1) +
            "**"
        );
        client.fs.writeFile("./config.json", JSON.stringify(client.con, null, 2), function(e) {
          if (e) throw e;
        });
        
    }  
}