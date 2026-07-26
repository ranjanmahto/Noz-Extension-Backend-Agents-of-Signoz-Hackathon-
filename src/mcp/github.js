const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
require("dotenv").config();

let client = null;
let transport = null;


function parseMcpResponse(response) {
  try {
    return JSON.parse(response?.content?.[0]?.text || "{}");
  } catch {
    return {};
  }
}


async function connect() {
  if (client) {
    
    return client;
  }

  if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    return;
  }

  transport = new StdioClientTransport({
    command: "docker",
    args: [
        "run",
      "-i",         
      "--rm",        
      "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", 
      "ghcr.io/github/github-mcp-server:latest"
    ],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
    }
  });

  client = new Client(
    {
      name: "github-mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {}
    }
  );

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
  const client= await connect();
  const response = await client.listTools();
  return response.tools;
}

(async () => {
   const tools = await listTools();
   
})();

async function callTool(toolName, argumentsObject = {}) {
  const client= await connect();
  return await client.callTool({
    name: toolName,
    arguments: argumentsObject,
  });
}

async function listRepositories(query){
    const client= await connect();
    const response= await client.callTool({
        name:"get_me",
        arguments:{

        }
    });
    
    const username= JSON.parse(response.content[0].text).login;
    return await client.callTool({
        name: "search_repositories",
        arguments: {
            query: `user:${username}`
        }
    });
}


async function listCommits(owner, repo) {
  return callTool("list_commits", {
    owner,
    repo
  });
}


async function searchRepositories(query, owner, repo) {
  return callTool("search_repositories", {
    query,
    owner,
    repo
  });
}

module.exports = {
  connect,
  disconnect,
  listTools,
  callTool,
  listCommits,
  searchRepositories,
  parseMcpResponse,
  listRepositories
};