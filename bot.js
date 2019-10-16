const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const speeches = require('./custom-speech.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author != this.user)
    msg.channel.send(createIntervention(msg));
});

let createIntervention = function(msg) {

}

let trashTalk = function() {
  let talks = speeches.trashTalk;
  //randomly chooses
}

let stupidRepeat = function(msg) {

}

let weirdGIF = function () {

}

let randomGIF = function () {

}

client.login(auth.token);
