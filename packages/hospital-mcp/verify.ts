
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

async function verify() {
    console.log("Starting Hospital MCP Verification...");

    // Use absolute path to ensure certainty
    const scriptPath = path.resolve(process.cwd(), "src/index.ts");

    const transport = new StdioClientTransport({
        command: "bun",
        args: [scriptPath]
    });

    const client = new Client(
        {
            name: "hospital-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    await client.connect(transport);
    console.log("Connected to Hospital MCP!");

    // List tools
    const tools = await client.listTools();
    console.log("Available tools:", tools.tools.map(t => t.name));

    if (tools.tools.length !== 3) {
        throw new Error(`Expected 3 tools, found ${tools.tools.length}`);
    }

    // Test list_patients
    console.log("\nTesting list_patients...");
    const patients = await client.callTool({
        name: "list_patients",
        arguments: { limit: 2 }
    });
    console.log("list_patients result:", JSON.parse(patients.content[0].text));

    // Test read_patient_record (using ID from list)
    const patientList = JSON.parse(patients.content[0].text);
    if (patientList.patients.length > 0) {
        const pid = patientList.patients[0].patient_id;
        console.log(`\nTesting read_patient_record for ${pid}...`);
        const record = await client.callTool({
            name: "read_patient_record",
            arguments: { patient_id: pid }
        });
        console.log("read_patient_record result:", JSON.parse(record.content[0].text));

        // Test get_emergency_contacts
        console.log(`\nTesting get_emergency_contacts for ${pid}...`);
        const contacts = await client.callTool({
            name: "get_emergency_contacts",
            arguments: { patient_id: pid }
        });
        console.log("get_emergency_contacts result:", JSON.parse(contacts.content[0].text));
    }

    console.log("\nVerification Successful!");
    process.exit(0);
}

verify().catch(console.error);
