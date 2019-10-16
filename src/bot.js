const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('../auth.json');
const reactions = require('../custom-reactions.json');
const request = require('request');
const utils = require('./utils.js');
const spongebob = 'media/Mocking-Spongebob.jpg';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.username + '#' + msg.author.discriminator != client.user.tag) {
    react(msg);
  }
});

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
  let url = 'http://api.giphy.com/v1/gifs/search?api_key=' + auth.giphyToken + '&q=' + query;
  request(url, { json : true }, (err, res, body) => {
    if (res.statusCode === 200) {
      let i = utils.randomInt(body.data.length);
      msg.channel.send(body.data[i].url);
    }
  });
}

client.login(auth.discordToken);
