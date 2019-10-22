const Discord = require('discord.js');
const request = require('request');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const utils = require('./utils.js');
const auth = require('../auth.json');
const reactions = require('../custom-reactions.json');

const spongebob = 'media/Mocking-Spongebob.jpg';
const reactionChance = 100 / reactions.reactionPercent;

const discordToken = auth.debug ? auth.discordToken : process.env.DISCORD_TOKEN;
const giphyToken = auth.debug ? auth.giphyToken : process.env.GIPHY_TOKEN;

let init = function () {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(reactions.action.activity, { type: reactions.action.action });
  });
  client.on('message', msg => {
    if (msg.author.username + '#' + msg.author.discriminator != client.user.tag) {
      let reacting = utils.randomInt(reactionChance);
      if (reacting == 0) {
        console.log('Reacting to message from ' + msg.author.username);
        react(msg);
      }
      else {
        console.log('Ignoring message from ' + msg.author.username);
      }
    }
  });
  client.on("voiceStateUpdate", function (oldMember, newMember) {
    if (newMember.voiceChannelID && oldMember.voiceChannelID != newMember.voiceChannelID && newMember.user.tag !== client.user.tag && !client.guilds.get(newMember.guild.id).voiceConnection) {
      console.log(`Detecting member join`);
      greet(newMember.voiceChannel);
    }
  });
  client.login(discordToken).catch(console.error);
}

let react = function (msg) {
  let rdm = utils.randomInt(3);
  switch (rdm) {
    case 0:
      trashTalk(msg);
      break;
    case 1:
      repeatMockingly(msg);
      break;
    case 2:
      sendRandomGIF(msg);
      break;
    default:
      break;
  }
}

let trashTalk = function (msg) {
  let talks = reactions.trashTalk;
  let i = utils.randomInt(talks.length);
  msg.channel.send(talks[i], null);
}

let repeatMockingly = function (msg) {
  let res = '';
  let big = true;
  for (let letter of msg.content) {
    res += big ? letter.toUpperCase() : letter.toLowerCase();
    big = !big;
  }
  msg.channel.send(res, new Discord.Attachment(spongebob));
}

let sendRandomGIF = function (msg) {
  let searches = reactions.gifSearch;
  let i = utils.randomInt(searches.length);
  let query = searches[i];
  let url = 'http://api.giphy.com/v1/gifs/search?api_key=' + giphyToken + '&q=' + query;
  request(url, { json: true }, (err, res, body) => {
    if (res.statusCode === 200) {
      let i = utils.randomInt(body.data.length);
      msg.channel.send(body.data[i].url);
    }
    else {
      console.log(err);
    }
  });
}

let greet = function (channel) {
  channel.join().then((cnx) => {
    try {
      console.log('greeting...');
      let stream = ytdl(reactions.soundOnConnect, { filter : 'audioonly' });
      let dispatcher = cnx.playStream(stream, { seek : 0, volume : 0.2 });
      // dispatcher.on('end', () => {
      //   console.log('end...');
      //   channel.leave();
      //   dispatcher.destroy();
      // });
    }
    catch (e) {
      console.log('error');
      console.error(e);
      channel.leave();
    }
  }).catch(console.error);
}

init();