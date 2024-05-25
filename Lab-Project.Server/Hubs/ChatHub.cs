using Lab_Project.Server.Models;
using Microsoft.AspNetCore.SignalR;
using NuGet.Protocol;
using System.Collections;

namespace Lab_Project.Server.Hubs;

public static class Users
{
    public static Dictionary<string, string> users = [];
}
public class ChatHub : Hub
{
    public async void Connect(string id)
    {
        if (string.IsNullOrEmpty(id)) return;
        Users.users[id] = Context.ConnectionId;
        //await Clients.All.SendAsync("Users", Users.users);
    }
    public async Task SendMessage(string id, string senderId, string receiverId, string message, string sent)
    {
        if (message == null) return;
        //await Clients.All.SendAsync("ReceiveMessage", new { senderId, receiverId, message });
        await Clients.Client(Users.users[senderId]).SendAsync("ReceiveMessage", id, senderId, receiverId, message, sent);
        if(Users.users.TryGetValue(receiverId, out string? val)) await Clients.Client(Users.users[receiverId]).SendAsync("ReceiveMessage", id, senderId, receiverId, message, sent);
    }
}
