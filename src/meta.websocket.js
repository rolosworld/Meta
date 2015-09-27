Meta.websocket=Meta(Meta.websocketevent).extend({
  connect: function(u) {
    var me = this;
    me.set(new WebSocket(u));
    me.fire('connect');
  },
  close: function() {
    var me = this;
    me.get().close();
    me.fire('close');
  },
  send: function(d) {
    var me = this;
    var j=JSON.encode(d);
    me.get().send(j);
    me.fire('send',j);
  }
});
