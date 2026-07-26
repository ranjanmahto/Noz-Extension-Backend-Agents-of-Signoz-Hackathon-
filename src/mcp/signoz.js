const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");

require("dotenv").config();

let client = null;
let transport = null;


async function connect() {
  if (client) {
    return client;
  }

  transport = new StdioClientTransport({
    command:
      "<your signoz mcp server location in wsl>",

    env: {
      ...process.env,
      SIGNOZ_URL: process.env.SIGNOZ_URL,
      SIGNOZ_API_KEY: process.env.SIGNOZ_API_KEY,
    },
  });

  client = new Client({
    name: "Noz-Flow",
    version: "1.0.0",
  });

  await client.connect(transport);


  return client;
}


async function disconnect() {
  if (!client) {
    return;
  }

  await client.close();

  client = null;
  transport = null;

}


async function listTools() {
  await connect();

  const response = await client.listTools();

  return response.tools;
}


async function callTool(toolName, argumentsObject = {}) {
  await connect();

  const response = await client.callTool({
    name: toolName,
    arguments: argumentsObject,
  });

  return response;
}

async function listServices(timeRange = "24h") {
  return callTool("signoz_list_services", {
    timeRange,
    limit: 100,
  });
}

async function listAlerts(timeRange = "24h") {
  return callTool("signoz_list_alerts", {
    timeRange,
  });
}

async function searchLogs(timeRange = "24h") {
  return callTool("signoz_search_logs", {
    timeRange,
  });
}

async function searchTraces(timeRange = "24h") {
  return callTool("signoz_search_traces", {
    timeRange,
  });
}

listTools();

module.exports = {
  connect,
  disconnect,

  listTools,

  callTool,

  listServices,

  listAlerts,

  searchLogs,

  searchTraces,
};