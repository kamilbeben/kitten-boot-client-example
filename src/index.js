import KittenBootClient from 'kitten-boot-client'

const CONSOLE_PREFIX = '[kitten-boot-client-example]';

var onUpdateCounter = 0;

const onBroadcastedMessageReceived = (message) => {
  console.log(CONSOLE_PREFIX, 'Broadcasted message received', message);
};

const client = KittenBootClient.init({
  url: 'http://localhost:8080',
  registerEndpoint: '/custom_register',
  messageBrokerPrefix: '/custom_game_get',
  applicationDestinationPrefix: '/custom_game_post',
  
  onUpdate: (data) => {
    if (onUpdateCounter++ % 100 !== 0) return;
    console.log(CONSOLE_PREFIX, `Update number ${onUpdateCounter}`, data)
  },
  
  // it is important to subscribe, send messages after websocket connection is established.
  // This is a good place to do so.
  onConnect: () => {
    // most of methods of KittenBootSocket returns itself, so chaining them is possible
    client.joinPublicQueue()
      // subscribe to custom topic (public, broadcasted, second parameter is false)
      .subscribe('/broadcasted_message', false, onBroadcastedMessageReceived)
      // subscribe to custom topic (private, sent to one user only, second parameter is true)
      .subscribe('/private_message', true, () => {});

    // sending custom message to server
    // if you are out of your variable scope you can always use KittenBootClient.instance() to access the instance you initialized calling init function
    KittenBootClient.instance().send('/broadcast_message', 'This is message sent from client to server, then from server to all clients');
  }
})
