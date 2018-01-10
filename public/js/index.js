var socket = io();

socket.on('connect',function () {
    console.log('Connected to the server');
});

socket.on('disconnect',function (){
    console.log("user has disconnected from the server");
});

socket.on('newMessage',function(message){
    console.log("newMessage" ,message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} : ${message.text}`);
    jQuery('#messages').append(li);
});
socket.on('newLocationMessage',function(location){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My current Location </a>');
    li.text(`${location.from} : `);
    a.attr('href',location.url);
    li.append(a);
    jQuery('#messages').append(li);
});

//jQuery
jQuery('#message-form').on('submit',function(e){
     e.preventDefault(); //prevent the default behavior of the event .
     
     var messageTextBox = jQuery('[name=message]');
     socket.emit('createMessage',{
         from:'User',
         text:messageTextBox.val()
     },function(){
        messageTextBox.val('');
     });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
       return alert("Geolocation doesn't supported by your browser");
    }

    locationButton.attr('disabled','disabled').text('Sending location .... ');
    
    navigator.geolocation.getCurrentPosition(function(position){
     locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage',{
          latitude:position.coords.latitude,
          longitude:position.coords.longitude
      });
    },function(){
       locationButton.removeAttr('disabled').text('Send location');
       alert('Unable to fetch location.');
    });

});