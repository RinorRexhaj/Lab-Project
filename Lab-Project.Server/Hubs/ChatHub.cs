using Microsoft.AspNetCore.SignalR;

namespace Lab_Project.Server.Hubs;

public static class Connections
{
    public static Dictionary<int, string> Users = [];
}
public class ChatHub : Hub
{
    public async void Connect(int id)
    {
        if (id < 100) return;
        Connections.Users[id] = Context.ConnectionId;
    }

    public void Disconnect(int id)
    {
        if(id < 100) return;
        Connections.Users.Remove(id);
    }

    public async Task SendMessage(int id, int senderId, int receiverId, string message, string sent)
    {
        if (message == null || id <= 0 || senderId < 100 || receiverId < 100 || sent == null) return;
        await Clients.Client(Connections.Users[senderId]).SendAsync("ReceiveMessage", id, senderId, receiverId, message, sent);
        if(Connections.Users.TryGetValue(receiverId, out string? val)) await Clients.Client(Connections.Users[receiverId]).SendAsync("ReceiveMessage", id, senderId, receiverId, message, sent);
    }

    public async Task EditMessage(int id, int senderId, int receiverId, string message)
    {
        if (id < 0 || senderId < 100 || receiverId < 100) return;
        if (Connections.Users.TryGetValue(receiverId, out string? val)) await Clients.Client(Connections.Users[receiverId]).SendAsync("EditedMessage", id, senderId, receiverId, message);
    }

    public async Task DeleteMessage(int id, int senderId, int receiverId)
    {
        if (id < 0 || senderId < 100 || receiverId < 100) return;
        if (Connections.Users.TryGetValue(receiverId, out string? val)) await Clients.Client(Connections.Users[receiverId]).SendAsync("DeletedMessage", id, senderId, receiverId);
    }

    public async Task SendTyping(int senderId, int receiverId)
    {
        if (senderId < 100 || receiverId < 100) return;
        if (Connections.Users.TryGetValue(receiverId, out string? val)) await Clients.Client(Connections.Users[receiverId]).SendAsync("ReceiveTyping", senderId);
    }

    public async Task RemoveTyping(int senderId, int receiverId)
    {
        if (receiverId < 100) return;
        if (Connections.Users.TryGetValue(receiverId, out string? val)) await Clients.Client(Connections.Users[receiverId]).SendAsync("RmvTyping", senderId);
    }

    public async Task SendSeen(int senderId, int receiverId)
    {
        if(senderId < 100 || receiverId < 100) return ;
        if (Connections.Users.TryGetValue(receiverId, out string? val)) await Clients.Client(Connections.Users[receiverId]).SendAsync("ReceiveSeen", senderId);
    }

    public async Task SameChat(int senderId, int receiverId)
    {
        if (senderId < 100 || receiverId < 100) return;
        if (!Connections.Users.TryGetValue(receiverId, out string? val)) return;
        //await Clients.Client(Connections.Users[senderId]).SendAsync("ReceiveSameChat", senderId, receiverId);
        await Clients.Client(Connections.Users[receiverId]).SendAsync("ReceiveSameChat", senderId, receiverId);
    }

    public async Task ConfirmSameChat(int senderId, int openChatId)
    {
        if (senderId < 100 || openChatId < 100) return;
        if (!Connections.Users.TryGetValue(senderId, out string? value)) return;
        await Clients.Client(Connections.Users[senderId]).SendAsync("ReceiveConfirmSameChat", senderId, openChatId);
    }
}

