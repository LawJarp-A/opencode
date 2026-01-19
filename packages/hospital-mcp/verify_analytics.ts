import { spawn } from "child_process";

const MCP_SERVER_PATH = "/Users/gg/Documents/ShopOS/packages/hospital-mcp/src/index.ts";

async function runTool(toolName: string, args: any = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn("bun", ["run", MCP_SERVER_PATH], {
            stdio: ["pipe", "pipe", "inherit"],
        });

        const request = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/call",
            params: {
                name: toolName,
                arguments: args,
            },
        };

        let output = "";

        proc.stdout.on("data", (data) => {
            output += data.toString();
        });

        proc.on("close", (code) => {
            if (code !== 0) {
                console.error(`Process exited with code ${code}`);
                // Don't reject, just return what we got to see errors
            }
            try {
                // Parse the last line as it likely contains the JSON response
                // The server might output logs before the response
                const lines = output.trim().split("\n");
                const lastLine = lines[lines.length - 1];
                const json = JSON.parse(lastLine);

                if (json.error) {
                    console.error(`MCP Error for ${toolName}:`, json.error);
                } else if (json.result) {
                    const content = JSON.parse(json.result.content[0].text);
                    console.log(`\n✅ ${toolName} Result:`, JSON.stringify(content, null, 2).substring(0, 500) + "...");
                } else {
                    console.log("Raw output:", output);
                }
                resolve(true);
            } catch (e) {
                console.error(`Failed to parse output for ${toolName}:`, output);
                resolve(false);
            }
        });

        proc.stdin.write(JSON.stringify(request) + "\n");
        proc.stdin.end();
    });
}

async function verify() {
    console.log("Starting Analytics Tools Verification...");

    // Test Clinical Tool
    await runTool("analyze_readmission_risk");

    // Test Pharmacy Tool
    await runTool("calculate_medication_adherence", { unit: "ICU" });

    // Test Compliance Tool
    await runTool("detect_vip_snooping");

    // Test Financial Tool (Core)
    await runTool("get_financial_metrics", { period: "2024" });

    // Test Operational Tool (Core)
    await runTool("get_operational_metrics", { department: "Emergency" });

    // Test Clinical Metrics (Core)
    await runTool("get_clinical_metrics");

    console.log("Verification Complete.");
}

verify();
