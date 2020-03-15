module.exports = {
    name: "restore",
    alias: ["back", "res"],
    run: function(client, message) {
        if (
            !client.owners.includes(message.author.id) ||
            !message.guild.ownerID == message.author.id
          )
          
            return message.channel.send(":x: **Only owner can use that!**");
          if (!client.oldperms[message.guild.id] || client.oldperms[message.guild.id].length == 0)
            return message.channel.send(":x: **No roles to restore.**");
          message.channel.send(":clock1: **Restoring Roles**").then(msg => {
            for (const perm of client.oldperms[message.guild.id]) {
              msg.edit(":clock2: **Restoring `" + perm.name + "`**");
              let role = message.guild.roles.get(perm.id);
              if (role) role.setPermissions(perm.permissions);
              setTimeout(() => {}, 1000);
            }
            msg.edit(
              `**:white_check_mark: Finished.\nRoles restored: \`${client.oldperms[
                message.guild.id
              ]
                .map(perm => perm.name)
                .join(", ")}\`**`
            );
          });
    }
}