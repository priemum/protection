module.exports = {
    name: "bot",
    alias: ["me"],
    run: async function(client, message) {
        let args = message.content
        .split(" ")
        .slice(1)
        .join(" ");
      let value = message.content
        .split(" ")
        .slice(2)
        .join(" ");
      let owner = message.mentions.users.first() || await client.fetchUser(message.content.split(" ")[3]);

      if (!client.owners.includes(message.author.id))
        return message.channel.send(":x: **Only owner can use that!**");
      if (!args) {
        return message.channel.send(`**Owner Commands:**

**\`${client.prefix}bot <name/avatar/owners [add, remove] <id>>\` changes bot (name/avatar/owners) settings.**

**\`${client.prefix}bot info\` shows current data (account, limits, owners).**

`);
      } else {
        if (args.startsWith("name")) {
          if (!value)
            return message.channel.send(
              "**Current name is `" + client.user.username + "`**"
            );
          try {
            client.user.setUsername(value);
            message.channel.send(
              "**User name has been set to `" + value + "`**"
            );
          } catch (e) {
            return message.channel.send(
              e.message + " **You can change the name only twice in hour**"
            );
          }
        } else if (args.startsWith("avatar")) {
          if (!value)
            return message.channel.send(
              "**Current name is `" + client.user.avatarURL + "`**"
            );
          try {
            client.user.setAvatar(value);
            message.channel.send(
              "**User avatar has been set to `" + value + "`**"
            );
          } catch (e) {
            return message.channel.send(
              e.message + " **You can change the avatar only twice in hour**"
            );
          }
        } else if (args.startsWith("prefix")) {
          if (!value)
            return message.channel.send(
              "**Current prefix is `" + client.prefix + "`**"
            );
          client.prefix = value;
          message.channel.send(
            "**Bot prefix has been set to `" + value + "`**"
          );
          client.user.setActivity(`${client.prefix}help.`);
        } else if (args.startsWith("owners")) {
          if (!value)
            return message.channel.send(
              "**Current owners are `" +
                client.owners.map(cowner =>
                  client.users.get(cowner)
                    ? client.users.get(cowner).username
                    : "Unknown User"
                ) +
                "`**"
            );

          if (value.startsWith("add")) {
            if (!owner)
              return message.channel.send(
                `**Usage**: \`${client.prefix}bot owners ${
                  value.split(" ")[0]
                } <@user>\``
              );
            client.owners.push(owner.id);
            return message.channel.send(
              "**New owners are `" +
                client.owners.map(cowner =>
                  client.users.get(cowner)
                    ? client.users.get(cowner).username
                    : "Unknown User"
                ) +
                "`**"
            );
          } else if (value.startsWith("remove")) {
            if (!owner)
              return message.channel.send(
                `**Usage**: \`${client.prefix}bot owners ${
                  value.split(" ")[0]
                } <@user>\``
              );
            const index = client.owners.indexOf(owner.id);
            if (index > -1) {
              client.owners.splice(index, 1);
            }
            return message.channel.send(
              "**New owners are `" +
                client.owners.map(cowner =>
                  client.users.get(cowner)
                    ? client.users.get(cowner).username
                    : "Unknown User"
                ) +
                "`**"
            );
          }
        } else if (args.startsWith("info")) {
          message.channel.send(`**:robot: \`${client.user.username}\` Data:  
      Name: \`${client.user.username}\`
      Prefix: \`${client.prefix}\`
      Owners: \`${client.owners.map(cowner =>
        client.users.get(cowner)
          ? client.users.get(cowner).username
          : "Unknown User"
      )}\`

\`\`\`All above data can be modified by typing ${client.prefix}bot\`\`\`**`);
        }
      }
      client.config.owners = client.owners;
      client.config.prefix = client.prefix;
      client.fs.writeFile("./bot.json", JSON.stringify(client.config, null, 2), function(e) {
        if (e) throw e;
      });
    }  
}