// index.js
// Where the work starts

const Discord = require("discord.js");
const env = require("dotenv").load;

module.exports.run = () => {
  const client = new Discord.Client()
  client.login(process.env.TOKEN);
  client.fs = require("fs");
  
  client.anti = JSON.parse(client.fs.readFileSync("./antigreff.json", "UTF8"));
  client.con = JSON.parse(client.fs.readFileSync("./config.json", "UTF8"));
  // client.eval = eval;
  client.config = require("./bot.json");
  client.oldperms = {};
  client.commands = new Discord.Collection(); 
  client.prefix = client.config.prefix;
  client.alises = new Discord.Collection();
  client.owners = client.config.owners;
  
  client.on("ready", () => {
    client.user.setActivity(`${client.prefix}help.`);
    console.log("Begun");

    client.fs.readdir("./commands/", (error, files) => {
      if (error) throw error;
      files.forEach(file => {
        let commandName = file.split(".js")[0];
        let command = require("./commands/" + commandName);
        client.commands.set(commandName, command);
        command.alias.forEach(alias => {
          client.alises.set(alias, command);
        });
      });
    });
  });

  client.on("message", message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.prefix)) return;

    if (!client.anti[message.guild.id + message.author.id])
      client.anti[message.guild.id + message.author.id] = {
        actions: 0
      };
    if (!client.con[message.guild.id])
      client.con[message.guild.id] = {
        members: client.config.defualtlimit,
        channels: client.config.defualtlimit,
        roles: client.config.defualtlimit,
        time: client.config.defualttime,
        toggle: client.config.defualttoggle,
        bots: client.config.defualttoggle,
        whitelist: []
      };

    let args = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/g);
    let commandName = args.shift().toLowerCase();

    try {
      let command = require("./commands/" + commandName + ".js");
      if (!command) return;
      client.commands.get(commandName).run(client, message);
    } catch (error) {
      if (client.alises.get(commandName)) {
        client.alises.get(commandName).run(client, message);
      } else return;
    }
  });

  client.on("message", async message => {
    if (message.content == client.prefix + "restore") {
      
    }
  });

  client.on("channelDelete", async channel => {
    const entry1 = await channel.guild
      .fetchAuditLogs({ type: "CHANNEL_DELETE" })
      .then(audit => audit.entries.first());
    // console.log(entry1.executor.username)
    const entry = entry1.executor;
    addAction(entry, "channels", channel.guild);
  });

  client.on("channelCreate", async channel => {
    // console.log(channel.guild)

    if (channel.type == "dm") return;
    const entry1 = await channel.guild
      .fetchAuditLogs({ type: "CHANNEL_CREATE" })
      .then(audit => audit.entries.first());
    // console.log(entry1.executor.username)
    const entry = entry1.executor;
    addAction(entry, "channels", channel.guild);
  });

  client.on("roleDelete", async channel => {
    const entry1 = await channel.guild
      .fetchAuditLogs({ type: "ROLE_DELETE" })
      .then(audit => audit.entries.first());
    // console.log(entry1.executor.username)
    const entry = entry1.executor;
    addAction(entry, "roles", channel.guild);
  });

  client.on("roleCreate", async channel => {
    const entry1 = await channel.guild
      .fetchAuditLogs({ type: "ROLE_CREATE" })
      .then(audit => audit.entries.first());
    // console.log(entry1)
    const entry = entry1.executor;
    addAction(entry, "roles", channel.guild);
  });

  client.on("guildBanAdd", async (guild, user) => {
    const entry1 = await guild
      .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
      .then(audit => audit.entries.first());
    // console.log(entry1.executor.username)
    const entry = entry1.executor;
    addAction(entry, "members", guild);
  });

  client.on("guildMemberRemove", async member => {
    const entry1 = await member.guild
      .fetchAuditLogs()
      .then(audit => audit.entries.first());
    if (entry1.action === "MEMBER_KICK") {
      const entry2 = await member.guild
        .fetchAuditLogs({ type: "MEMBER_KICK" })
        .then(audit => audit.entries.first());
      const entry = entry2.executor;
      addAction(entry, "members", member.guild);
    }
  });

  client.on("guildMemberAdd", member => {
    // console.log("AN")
    if (member.user.bot) {
      // console.log("ANT")
      if (client.con[member.guild.id].bots == "on") {
        // console.log("ANTI")
        execute(member.user, member.guild, "bot");
      }
    }
  });
  function addAction(entry, limit, guild) {
    
    // console.log(entry.username, " ", guild.id, " ", client.con[guild.id][limit]);
    
    if (!client.con[guild.id])
      client.con[guild.id] = {
        members: client.config.defualtlimit,
        channels: client.config.defualtlimit,
        roles: client.config.defualtlimit,
        time: client.config.defualttime,
        toggle: client.config.defualttoggle,
        bots: client.config.defualttoggle,
        whitelist: []
      };
      if (!client.anti[guild.id + entry.id]) {
        client.anti[guild.id + entry.id] = {
          actions: 1
        };
        setTimeout(() => {
          client.anti[guild.id + entry.id].actions = "0";
        }, client.con[guild.id].time * 1000);
      } else {
        client.anti[guild.id + entry.id].actions = Math.floor(
          client.anti[guild.id + entry.id].actions + 1
          );
          // console.log("TETS");
          setTimeout(() => {
            client.anti[guild.id + entry.id].actions = "0";
          }, client.con[guild.id].time * 1000);
          if (client.anti[guild.id + entry.id].actions >= client.con[guild.id][limit]) {
            execute(entry, guild);
          }
        }
        
        client.fs.writeFile("./config.json", JSON.stringify(client.con, null, 2), function(e) {
          if (e) throw e;
        });
        client.fs.writeFile("./antigreff.json", JSON.stringify(client.anti, null, 2), function(
          e
          ) {
            if (e) throw e;
          });
        }
        
        function execute(entry, guild, type = "member") {
          if(guild.ownerID == entry.id) return "Cant Execute - Server Owner";
          console.log(client.owners);
          
          if(client.owners.includes(entry.id)) return "Cant Execute - My Owner";
          console.log(client.con[guild.id].whitelist);
          
          if (client.con[guild.id].whitelist.includes(entry.id)) return "Cant Execute - Whitelisted";
          client.oldperms[guild.id] = [];
          // console.log("Sfg")
          let permissions = [
            "BAN_MEMBERS",
            "KICK_MEMBERS",
            "ADMINISTRATOR",
            "MANAGE_CHANNELS",
            "MANAGE_ROLES",
            "MANAGE_GUILD"
          ];
          let message = {
            user: entry,
            message: "",
            action: ""
          };
          if (type == "member") {
            message = {
              user: entry,
              message: `<@${entry.id}> Crossed limits`,
              action: ""
            };
            guild.members.get(entry.id).roles.forEach(role => {
              for (const permission of permissions) {
                if (role.hasPermission(permission)) {
                  client.oldperms[guild.id].push({
                    id: role.id,
                    name: role.name,
                    permissions: role.permissions
                  });
                  role
                  .setPermissions(
                    0,
                    "GUARDIAN PROTECTION. USER: " +
                    entry.username +
                    `(ID:${entry.id})`
                    )
                    .then(
                      (message.action += `:white_check_mark: ${role.name}: Permissions cleared \n`)
                      )
                      .catch(
                        e => (message.action += `:x: ${role.name}: ${e.message} \n`)
                        );
                        break;
                      }
                    }
                  });
                  client.anti[guild.id + entry.id].actions = "0";
                  client.fs.writeFile("./antigreff.json", JSON.stringify(client.anti, null, 2), function(
                    e
                    ) {
                      if (e) throw e;
                    });
                  } else if (type == "bot") {
                    message = {
                      user: entry,
                      message: "The Bot <@" + entry.id + "> Has Joind the server",
                      action: ":white_check_mark: **" + entry.username + " Has been kicked**"
                    };
                    guild.members.get(entry.id).kick("GUARDIAN ANTIBOTS ACTIVATED!");
                  }
                  let embed = new Discord.RichEmbed()
                  .setTitle(`${guild.name} :warning: PROTECTION ALERT :warning:`)
                  .setDescription(`**${message.message}**`)
                  .addField(
                    "**Actions:**",
                    message.action.length > 1
                    ? message.action +
                    (type == "bot"
                    ? ""
                    : `\n**To restore all changes use \`${client.prefix}restore\` command**`)
                    : "Nothing changed"
                    )
                    .setFooter(``);
                    guild.owner.send({ embed: embed });
                    return "Executed."
                  }
                  
                  module.exports.addAction = addAction;
                  module.exports.execute = execute;
                  
                };
                
