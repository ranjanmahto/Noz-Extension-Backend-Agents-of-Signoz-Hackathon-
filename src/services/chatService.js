require("dotenv").config();
const { OpenAI } = require("openai");
const githubMcp = require("../mcp/github");
const signozMcp = require("../mcp/signoz");
const mappingStore = require("../utils/mappingStore");

const mappings = mappingStore.get();
const mappingText = mappings
  .map(
    ({ service, repository }) =>
      `- ${service} → ${repository}`
  )
  .join("\n");
const systemPrompt = `
You are an SRE Assistant.

Current service to repository mapping:

${mappingText}

Rules:
- Whenever the user asks about a service, first identify its mapped repository.
- Use the mapped repository when calling GitHub tools.
- Never ask the user which repository to use if a mapping exists.
`;




function parseMcpResponse(response) {
  try {
    return JSON.parse(response?.content?.[0]?.text || "{}");
  } catch {
    return {};
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function formatMcpTools(tools) {
  return tools.map(t => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema
    }
  }));
}

async function processChat(question) {
  const githubTools = await githubMcp.listTools();
  const signozTools = await signozMcp.listTools();
  
  const allTools = [
    ...formatMcpTools(githubTools),
    ...formatMcpTools(signozTools)
  ];

  const messages = [{
    role: "system",
    content: systemPrompt,
  },
  ...question,
  ];

  while (true) {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      tools: allTools,
    });

    const message = response.choices[0].message;
    messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      return message.content;
    }

    for (const toolCall of message.tool_calls) {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      let result;

      if (githubTools.find(t => t.name === name)) {
        result = await githubMcp.callTool(name, args);
      } else {
        result = await signozMcp.callTool(name, args);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        name,
        content: JSON.stringify(parseMcpResponse(result))
      });

    }
  }
}

module.exports = { processChat };