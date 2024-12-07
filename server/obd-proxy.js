const WebSocket = require("ws");
const net = require("net");
require("dotenv").config();

const WS_SERVER_PORT = process.env.WS_SERVER_PORT || 8080;
const OBD_SIMULATOR_HOST = process.env.OBD_SIMULATOR_HOST || "192.168.1.74";
const OBD_SIMULATOR_PORT = process.env.OBD_SIMULATOR_PORT || 35000;

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const wss = new WebSocket.Server({ port: WS_SERVER_PORT });
console.log(`WebSocket server listening on port ${WS_SERVER_PORT}`);

function connectToOBDSimulator(tcpClient, ws, retryCount = 0) {
  console.log(
    `Attempting to connect to OBD simulator (attempt ${
      retryCount + 1
    }/${MAX_RETRIES})`
  );

  tcpClient.connect(OBD_SIMULATOR_PORT, OBD_SIMULATOR_HOST, () => {
    console.log(
      `Connected to OBD simulator at ${OBD_SIMULATOR_HOST}:${OBD_SIMULATOR_PORT}`
    );
  });

  tcpClient.on("error", (error) => {
    console.error("TCP error:", error);

    if (error.code === "ETIMEDOUT" && retryCount < MAX_RETRIES) {
      console.log(
        `Connection attempt failed. Retrying in ${
          RETRY_DELAY / 1000
        } seconds...`
      );
      setTimeout(() => {
        connectToOBDSimulator(tcpClient, ws, retryCount + 1);
      }, RETRY_DELAY);
    } else {
      ws.send(
        JSON.stringify({
          error: error.message,
          details: `Failed to connect to OBD simulator at ${OBD_SIMULATOR_HOST}:${OBD_SIMULATOR_PORT}`,
        })
      );
    }
  });

  tcpClient.on("connect", () => {
    console.log("Successfully connected to OBD simulator");
  });

  tcpClient.on("data", (data) => {
    console.log("Received from OBD:", data.toString());
    ws.send(data.toString());
  });

  tcpClient.on("close", () => {
    console.log("TCP connection closed");
    ws.close();
  });
}

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  const tcpClient = new net.Socket();

  connectToOBDSimulator(tcpClient, ws);

  ws.on("message", (message) => {
    console.log("Received from app:", message.toString());
    if (tcpClient.writable) {
      tcpClient.write(message.toString());
    } else {
      console.log("TCP client not writable, attempting to reconnect...");
      connectToOBDSimulator(tcpClient, ws);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    tcpClient.destroy();
  });
});

wss.on("error", (error) => {
  console.error("WebSocket Server Error:", error);
});

// Check if OBD simulator is accessible
const testConnection = new net.Socket();
testConnection
  .connect(OBD_SIMULATOR_PORT, OBD_SIMULATOR_HOST, () => {
    console.log("✅ OBD simulator is accessible");
    testConnection.destroy();
  })
  .on("error", (error) => {
    console.error("❌ OBD simulator is not accessible:", error.message);
    console.log(
      `Please ensure OBD simulator is running at ${OBD_SIMULATOR_HOST}:${OBD_SIMULATOR_PORT}`
    );
  });

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing WebSocket server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
});
