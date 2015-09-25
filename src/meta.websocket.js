Meta.websocket=Meta(Meta.websocketevent).extend({
  connect: function(url) {
    var me = this;
    me.set(new WebSocket(url));
    me.fire('connect');
  },
  close: function() {
    me.get().close();
    me.fire('close');
  },
  send: function(data) {
    me.get().send(JSON.encode(data));
    me.fire('send');
  }
});
