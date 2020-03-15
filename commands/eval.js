module.exports = {
    name: "eval",
    alias: ["ev", "exec"],
    run: function(client, message) {
        // 
        const args = message.content.split(" ").slice(1);
        if (!client.owners.includes(message.author.id)) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled); 
            }
        message.channel.send(clean(evaled), { code: "xl" });
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
      function clean(text) {
        if (typeof text === "string") {
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(client.token, "[TOKEN]");
        } else {
          return text;
        }
      }
    }
    
}