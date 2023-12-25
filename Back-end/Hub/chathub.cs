using Microsoft.AspNetCore.SignalR;
using Mondaycom2.Model;

namespace SignalR2.hub
{
    public class chathub : Hub
    {
        private readonly IDictionary<string, roomconnection> _connect;
        public chathub(IDictionary<string, roomconnection> connect)
        {
            _connect = connect;
        }
        public async Task joinRoom(roomconnection room)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomName);
            _connect[Context.ConnectionId] = room;

  //          await Clients.Group(room.RoomName).SendAsync(
  //                "recivemess", "BOT", $"{room.User} has join group", DateTime.Now
  //            );
  //          await Clients.Caller.SendAsync(
  //           "recivemessage", $"{room.User} has join group", DateTime.Now
  //);
            await sendConnectedUser(room.RoomName);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (!_connect.TryGetValue(Context.ConnectionId, out roomconnection rom))
            {
                return base.OnDisconnectedAsync(exception);
            }
            _connect.Remove(Context.ConnectionId);
            //Clients.Group(rom.RoomName).SendAsync("recivemess", $"{rom.User} has left group", DateTime.Now);
                
            sendConnectedUser(rom.RoomName);
            return base.OnDisconnectedAsync(exception);
        }

        public Task sendConnectedUser(string room)
        {
            var user = _connect.Values.Where(u => u.RoomName == room).Select(s => s.User);
            return Clients.Group(room).SendAsync("recivelist", user);
        }
    }
}
