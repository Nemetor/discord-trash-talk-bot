const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const speeches = require('./custom-speech.json');
const http = require('http');
const request = require('request');
const utils = require('./utils.js');

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
      res = trashTalk(msg);
    case 1:
      return repeatMockingly(msg);
    case 2:
      return sendWeirdGIF(msg);
    default:
      return null;
  }
}

let trashTalk = function (msg) {
  let talks = speeches.trashTalk;
  let i = utils.randomInt(talks.length);
  msg.channel.send(talks[i], null);
}

let repeatMockingly = function (msg) {
  let res = '';
  for (let letter of msg.content) {
    let rdm = utils.randomInt(2);
    if (rdm == 0) {
      res += letter.toLowerCase();
    }
    else {
      res += letter.toUpperCase();
    }
  }
  msg.channel.send(res, new Discord.Attachment('img/Mocking-Spongebob.jpg'));
}

let sendWeirdGIF = function (msg) {
  let url = 'http://api.giphy.com/v1/gifs/search?api_key=' + auth.giphyToken + '&q=weird';
  request(url, { json : true }, (err, res, body) => {
    if (res.statusCode === 200) {
      let i = utils.randomInt(body.data.length);
      console.log(body.data[i].embed_url);
      msg.channel.send(body.data[i].url);
    }
  });
}

client.login(auth.discordToken);
