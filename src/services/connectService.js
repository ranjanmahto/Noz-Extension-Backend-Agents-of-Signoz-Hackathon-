const github = require("../mcp/github");
const signoz = require("../mcp/signoz");
const mappingStore = require("../utils/mappingStore");

exports.getWorkspace = async () => {

    const githubClient = await github.connect();
    const signozClient = await signoz.connect();

    const repos = await github.listRepositories();
    const services = await signoz.listServices("5d");

    return {
        workspaceReady: mappingStore.isReady(),
        githubConnected: !!githubClient,
        signozConnected: !!signozClient,
        mappingDone: mappingStore.isReady(),
        repositories: repos,
        services: services
    };

}