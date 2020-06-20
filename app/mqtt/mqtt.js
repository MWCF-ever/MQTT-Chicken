const Koa = require('koa');
const app = new Koa();
const mqtt = require('mqtt');
const fs = require('fs')
const http = require('http').Server(app);
const io = require('socket.io')(http);



const options = {
    host:'mqtts.coventry.ac.uk',
    username:'302CEM',
    password:'n3fXXFZrjw',
    port:'8883',
    keepalive: 60,
    clean:true,
    connectTimeout: 4000,
    cert: fs.readFileSync('../CER/mqtt.crt')
}

const client = mqtt.connect('mqtts://mqtt.coventry.ac.uk', options)




client.on('connect', () => {
  console.log('Connected succesful!');
})

client.on('reconnect', (error) => {
  console.log('reconnect!', error);
})

client.on('error', (error) => {
    console.log(error, 'Connected error!');
    client.end();
})

//Subscribe from the broker 
client.on('connect', () => {
    console.log('Connected to broker!');
    //subscribe a topic
    client.subscribe('302CEM/Chicken/Sensor',{qos: 1 }, (error) => {
      if (!error) {
        console.log('Subscribe successful!');
        client.publish('302CEM/Chicken/Sensor', 'Hello mqtt', { qos:1, rein: false }, (error) => {
            console.log(error || 'Publishing successful!');
        })
      }
    })
  })
//litening the message event 
  client.on('message', (topic, message, payload) => {
    console.log('Receive the message from', topic, message.toString());
    io.sockets.emit('mqtt', {'topic': String(topic)})
  })

//sockets connect
io.sockets.on('connection', (socket) => {
  //sockets connection what subscribe from the broker
  socket.on('subscribe', (data) => {
    console.log('Subscribing to '+data.topic);
    socket.join(data.topic);
    client.subscribe(data.topic);
  })
  // when socket connection publishes a message, forward that message
  //the mqtt broker
  socket.on('publish', (data) => {
    console.log('Publishing to ' + data.topic);
    client.publish(data.topic)
  })
})