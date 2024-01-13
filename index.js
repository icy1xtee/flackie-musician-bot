/* eslint-disable quote-props */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
let botIcon = document.querySelector('.bot__icon');
let botTooltip = document.querySelector('.tooltip__bot');
const input = document.querySelector('.input-field__input');
const inputButton = document.querySelector('.input-field__button');

botIcon.addEventListener('mouseenter', () => {
  botTooltip.style.display = 'block';
});
botIcon.addEventListener('mouseleave', () => {
  botTooltip.style.display = 'none';
});

inputButton.addEventListener('click', () => {
  sendMessage();
  botReply(botMessageGenerator());
  scrollToBottom();
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
    botReply(botMessageGenerator());
    scrollToBottom();
    n = 0;
  }
});

// navigation through user messages: get data from previous user messages and put this text to the input line
let n = 0;
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    const userTexts = document.querySelectorAll('.user__text');
    if (n < userTexts.length) {
      n += 1;
    } else return;
    const currentText = userTexts[userTexts.length - n];
    input.value = currentText.innerText;
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    const userTexts = document.querySelectorAll('.user__text');
    if (n > 0) {
      n -= 1;
    } else return;
    if (n === 0) {
      input.value = '';
      return;
    }
    const currentText = userTexts[userTexts.length - n];
    input.value = currentText.innerText;
  }
});

// function to generate bot answer for user request
function botMessageGenerator() {
  const userTextNodeList = document.querySelectorAll('.user__text');
  const userLastMessage = userTextNodeList[userTextNodeList.length - 1].innerText;
  let botMessage = userLastMessage;

  const progressions = {
    'I-V-VI-IV': 'C, G, Am, F',
    'I-IV-V-IV': 'C, F, G, F',
    'II-V-I': 'Dm7, G7, C7',
    'I-VI-IV-V': 'C, Am, F, G',
    'Canon': 'C, G, Am, Em, F, C, F, G',
    'Effective In All Genres': 'Am, G, F, G',
    'Gaining Popularity': 'C, F, Am, G',
    'Timeless': 'C, G, F, G',
    'The Cadential': 'F, Dm, C/G, G, C',
    'Stepwise Bass Down': 'C, G/B, Am, G',
    'Stepwise Bass Up': 'C, Dm7, C/E, F',
    'The Newcomer': 'C, Em/B, Am, F',
    'Simple Yet Powerful': 'F, C/E, Dm',
    'The Chord That Pleased The Lord': 'F, G, E/G#, Am',
    'Expanding With V/Vi': 'C, E, Am',
    'VI42 As A Passing Chord': 'Am, Am/G, F',
    'Secondary Dominant': 'C, C7, F',
    'Applied VII': 'G, (G chord but G note -> G#), Am',
    'Cadencing In Style': 'F, Fm, C',
    'A Mixolydian Cadence': 'C, Bb, F, C',
    'Using The ♭VI To Set Up A V': 'C, Ab, G',
    'Cadencing Via ♭VII': 'C, G, F, Bb, C',
  };
  const progressionName = Object.keys(progressions);
  const progressionChords = Object.values(progressions);

  if (userLastMessage === '/p') {
    const randomNumber = Math.floor(Math.random() * progressionName.length);
    botMessage = `Progrssion called: ${progressionName[randomNumber]}, chords: ${progressionChords[randomNumber]}`;
  }
  if (userLastMessage === '/clear') {
    window.location = 'https://icy1xtee.github.io/flakie-musician-bot/';
  }
  if (userLastMessage === '/help') {
    botMessage = 'List of commands: \n/help - list of commands\n/p - i\'ll generate a chord progression for you\n/clear - this command will clear the whole chat';
  }
  return botMessage;
}

// function that add a message in div 'chat' from user
function botReply(botMessage) {
  // need to know if last message from the user or from the bot
  const chat = document.querySelector('.chat');
  const chatChildren = chat.children;
  const lastChildOfChat = chatChildren[chatChildren.length - 1];

  // if last message from user just add one bubbled-message
  if (lastChildOfChat.className === 'chat__messages user') {
    addChatBlockFromBot(botMessage);
  }

  // if last message from bot create new line of messages with userpic
  if (lastChildOfChat.className === 'chat__messages bot') {
    addMessageFromBot(botMessage);
  }

  // add event listener to usericon
  botIcon = document.querySelector('.bot__icon');
  botTooltip = document.querySelector('.tooltip__bot');
  botIcon.addEventListener('mouseenter', () => {
    botTooltip.style.display = 'block';
  });
  botIcon.addEventListener('mouseleave', () => {
    botTooltip.style.display = 'none';
  });
}

// function that creates a block of messages from user
function addChatBlockFromBot(message) {
  const chat = document.querySelector('.chat');

  const chatBlockBot = document.createElement('div');
  const botImage = document.createElement('img');
  const botImageTooltip = document.createElement('div');
  const botMessages = document.createElement('div');

  botMessages.className = 'bot__messages';
  botImageTooltip.className = 'tooltip__bot tooltip';
  botImageTooltip.innerText = 'icy1xtee-bot';
  botImage.src = './icons/bot-logo.gif';
  botImage.className = 'bot__icon userpic';
  chatBlockBot.className = 'chat__messages bot';

  botMessages.append(createMessage());

  const divMessage = botMessages.lastChild;
  divMessage.className = 'bot__messages_bubble';
  divMessage.lastChild.className = 'bot__text';
  replyWaiting(divMessage);

  chatBlockBot.append(botImage, botImageTooltip, botMessages);
  chat.append(chatBlockBot);

  setTimeout(() => {
    divMessage.lastChild.innerText = message;
  }, 600);
}

// function of waiting for reply appearance
function replyWaiting(div) {
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      div.lastChild.innerText = `${div.lastChild.innerText}.`;
    }, i * 150);
  }
}

// function that add a bubble-message from bot
function addMessageFromBot(message) {
  const botMessages = document.querySelector('.bot__messages');
  botMessages.append(createMessage());
  const divMessage = botMessages.lastChild;
  divMessage.className = 'bot__messages_bubble';
  divMessage.lastChild.className = 'bot__text';
  replyWaiting(divMessage);

  setTimeout(() => {
    divMessage.lastChild.innerText = message;
  }, 600);
}

// function that add a message in div 'chat' from user
function sendMessage() {
  // check if input contains anything
  if (input.value === '') {
    return;
  }

  // need to know if last message from the user or from the bot
  const chat = document.querySelector('.chat');
  const chatChildren = chat.children;
  const lastChildOfChat = chatChildren[chatChildren.length - 1];

  // if last message from user just add one bubbled-message
  if (lastChildOfChat.className === 'chat__messages user') {
    addMessageFromUser(input.value);
  }

  // if last message from bot create new line of messages with userpic
  if (lastChildOfChat.className === 'chat__messages bot') {
    addChatBlockFromUser(input.value);
  }

  // add event listener to usericon
  const userIcon = document.querySelector('.user__icon');
  const userTooltip = document.querySelector('.tooltip__user');
  userIcon.addEventListener('mouseenter', () => {
    userTooltip.style.display = 'block';
  });
  userIcon.addEventListener('mouseleave', () => {
    userTooltip.style.display = 'none';
  });

  input.value = '';
}

// function that creates a block of messages from user
function addChatBlockFromUser(message) {
  const chat = document.querySelector('.chat');

  const chatBlockUser = document.createElement('div');
  const userImage = document.createElement('img');
  const userImageTooltip = document.createElement('div');
  const userMessages = document.createElement('div');

  userMessages.className = 'user__messages';
  userImageTooltip.className = 'tooltip__user tooltip';
  userImageTooltip.innerText = 'you';
  userImage.src = './icons/user-logo.gif';
  userImage.className = 'user__icon userpic';
  chatBlockUser.className = 'chat__messages user';

  userMessages.append(createMessage());

  const divMessage = userMessages.lastChild;
  divMessage.className = 'user__messages_bubble';
  divMessage.lastChild.className = 'user__text';
  divMessage.lastChild.innerText = message;

  chatBlockUser.append(userImage, userImageTooltip, userMessages);
  chat.append(chatBlockUser);
}

// function that add a bubble-message from user
function addMessageFromUser(message) {
  const userMessages = document.querySelector('.user__messages');
  userMessages.append(createMessage());
  const divMessage = userMessages.lastChild;
  divMessage.className = 'user__messages_bubble';
  divMessage.lastChild.className = 'user__text';
  divMessage.lastChild.innerText = message;
}

// function that creates a bubble-message template
function createMessage() {
  const messageBubble = document.createElement('div');
  const messageText = document.createElement('p');

  messageBubble.append(messageText);
  return messageBubble;
}

function scrollToBottom() {
  const chat = document.querySelector('.chat');
  chat.scrollTop = chat.scrollHeight;
}
