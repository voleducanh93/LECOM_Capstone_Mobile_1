import * as SignalR from "@microsoft/signalr";

const HUB_URL = "https://lecom.click/hubs/chat";

class ChatHub {
  connection: SignalR.HubConnection | null = null;
  token: string | null = null;
  currentConversationId: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  createConnection() {
    this.connection = new SignalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => this.token ?? "",
      })
      .withAutomaticReconnect()
      .build();

    // join lại phòng khi reconnect
    this.connection.onreconnected(async () => {
      if (this.currentConversationId) {
        await this.connection!.invoke(
          "JoinConversation",
          this.currentConversationId
        );
      }
    });
  }

  async connect(conversationId: string) {
    if (!this.connection) this.createConnection();

    this.currentConversationId = conversationId;

    await this.connection!.start();
    await this.connection!.invoke("JoinConversation", conversationId);
  }

  onReceiveMessage(handler: (msg: any) => void) {
    this.connection?.on("ReceiveMessage", handler);
  }

  offReceiveMessage() {
    this.connection?.off("ReceiveMessage");
  }
}

export const chatHub = new ChatHub();
