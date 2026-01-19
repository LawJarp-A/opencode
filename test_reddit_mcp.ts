
import { spawn } from "child_process";

const command = "/bin/bash";
const args = [
    "-c",
    "cd '/Users/gg/Documents/ShopOS/Reddit MCP/reddit-mcp-gg' && REDDIT_CLIENT_ID='wwEXofDq3XsulyNYmdZRrw' REDDIT_CLIENT_SECRET='BX_A3WJeufqrc6jltrSXH6NUQ6oNvg' REDDIT_USERNAME='YOUR_USERNAME_HERE' REDDIT_PASSWORD='YOUR_PASSWORD_HERE' REDDIT_USER_AGENT='ShopOS_MCP_Agent' /Users/gg/.local/bin/uv run server.py"
];

console.log("Spawning Reddit MCP...");
const cp = spawn(command, args);

cp.stdout.on("data", (data) => {
    console.log(`STDOUT: ${data.toString()}`);
});

cp.stderr.on("data", (data) => {
    console.error(`STDERR: ${data.toString()}`);
});

cp.on("error", (err) => {
    console.error("Failed to start subprocess:", err);
});

cp.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
});

// Send initialize request
const initRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0" }
    }
};

setTimeout(() => {
    console.log("Sending initialize request...");
    cp.stdin.write(JSON.stringify(initRequest) + "\n");
}, 2000);

setTimeout(() => {
    console.log("Terminating...");
    cp.kill();
}, 10000);
