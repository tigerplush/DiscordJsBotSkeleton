const fs = require('fs');

/**
 * Create a config json
 */
if(!fs.existsSync('./config.json'))
{
    const defaultConfig = require('./default-config.json');
    fs.writeFileSync('./config.json', JSON.stringify(defaultConfig, null, 4));
}

/**
 * Create an empty authorization file
 */
if(!fs.existsSync('./auth.json'))
{
    const emptyAuth = {token: ""};
    fs.writeFileSync('./auth.json', JSON.stringify(emptyAuth, null, 4));
}

const Discord = require('discord.js');
const auth = require('./auth.json');
const {prefix} = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}

bot.on('ready', () => {
});

bot.on('message', message => {
    if(message.content.startsWith(prefix) && !message.author.bot)
    {
	    const command = args.shift().toLowerCase();

        const args = message.content.slice(prefix.length + 1).split(/ +/);
        if (!bot.commands.has(command))
        {
            return;
        }

        try
        {
            bot.commands.get(command).execute(message, args);
        } catch (error)
        {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    }
    
});

bot.login(auth.token)
.catch(err => console.log(err));
