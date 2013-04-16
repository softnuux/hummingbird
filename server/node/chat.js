var server = require("http").createServer();
var socket = require("socket.io").listen(server);
var xmpp = require("node-xmpp");
socket.on("connection", function(connection) {
 var client = new xmpp.Client({jid: "test@localhost", password: ""});
 client.on("online", function() {
  client.send(new xmpp.Element("presence", {type: "chat"}));
  client.send(new xmpp.Element("message", {to: "alagu@localhost", type: "chat"}).c("body").t("Testing"));
  connection.on("message", function(message) {
   client.send(new xmpp.Element("message", {to: "alagu@localhost", type: "chat"}).c("body").t(message));
  });
  connection.on("disconnect", function() {
   client.end();
  });
 });
 client.on("stanza", function(stanza) {
  if (stanza.is("message")) {
   var b = stanza.getChildren("body");
   if (b[0]) connection.send(b[0].getText());
  }
 });
});
server.listen(8080);
