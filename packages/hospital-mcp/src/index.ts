import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { listPatients, readPatientRecord, getEmergencyContacts } from "./tools.js";
import {
    identifyCriticalPatients,
    getPatientRiskProfile,
    analyzeUnitAcuity,
} from "./analytics-tools/critical-patients.js";
import {
    getClinicalMetrics,
    analyzeLabTrends,
    analyzeReadmissionRisk,
    trackCareGaps,
    calculateClinicalQualityMeasures,
} from "./analytics-tools/clinical-metrics.js";
import {
    getOperationalMetrics,
    analyzePatientFlow,
} from "./analytics-tools/operational-metrics.js";
import {
    getFinancialMetrics,
} from "./analytics-tools/financial-metrics.js";
import {
    calculateMedicationAdherence,
    predictInventoryShortages,
    monitorOpioidStewardship,
} from "./analytics-tools/pharmacy-metrics.js";
import {
    detectVIPSnooping,
    monitorBreakGlass,
    analyzeAccessLogs,
} from "./analytics-tools/compliance-metrics.js";
import {
    getInventoryDashboard,
    searchVendorCatalog,
} from "./analytics-tools/inventory-metrics.js";
import { analyticsEngine } from "./analytics/engine.js";

// Define tool definitions
const TOOL_DEFINITIONS: Tool[] = [
    {
        name: "list_patients",
        description: "List patients in the hospital system with pagination. Returns basic info.",
        inputSchema: {
            type: "object",
            properties: {
                limit: {
                    type: "number",
                    description: "Number of records to return (default 20)",
                },
                offset: {
                    type: "number",
                    description: "Offset for pagination (default 0)",
                },
            },
        },
    },
    {
        name: "read_patient_record",
        description: "Get the full medical and demographic record for a specific patient used for clinical and administrative purposes.",
        inputSchema: {
            type: "object",
            properties: {
                patient_id: {
                    type: "string",
                    description: "The unique Patient ID (e.g., PAT-001)",
                },
            },
            required: ["patient_id"],
        },
    },
    {
        name: "get_emergency_contacts",
        description: "Retrieve emergency contact information for a specific patient.",
        inputSchema: {
            type: "object",
            properties: {
                patient_id: {
                    type: "string",
                    description: "The unique Patient ID",
                },
            },
            required: ["patient_id"],
        },
    },
    {
        name: "identify_critical_patients",
        description: "Identify patients requiring immediate attention based on risk scores, vital signs, diagnoses, and location. Returns ranked list of critical patients with acuity scores and recommended actions.",
        inputSchema: {
            type: "object",
            properties: {
                unit: {
                    type: "string",
                    description: "Filter by hospital unit (e.g., 'ICU', 'Emergency Department')",
                },
                min_acuity_score: {
                    type: "number",
                    description: "Minimum acuity score threshold (0-100)",
                },
                include_stable: {
                    type: "boolean",
                    description: "Include stable patients (acuity < 40)",
                },
            },
        },
    },
    {
        name: "get_patient_risk_profile",
        description: "Get comprehensive risk assessment and clinical profile for a specific patient including risk scores, vital signs trends, active diagnoses, and recommended actions.",
        inputSchema: {
            type: "object",
            properties: {
                patient_id: {
                    type: "string",
                    description: "The unique Patient ID",
                },
            },
            required: ["patient_id"],
        },
    },
    {
        name: "analyze_unit_acuity",
        description: "Analyze overall acuity level and patient risk distribution for a hospital unit. Provides unit-level metrics including average acuity, critical patient count, and patient breakdown.",
        inputSchema: {
            type: "object",
            properties: {
                unit_name: {
                    type: "string",
                    description: "Name of the hospital unit (e.g., 'ICU', 'Emergency Department', 'Telemetry')",
                },
            },
            required: ["unit_name"],
        },
    },
    {
        name: "get_clinical_metrics",
        description: "Get key clinical quality metrics including mortality rates, readmission rates, infection rates, patient satisfaction, and surgical complication rates.",
        inputSchema: {
            type: "object",
            properties: {
                department: {
                    type: "string",
                    description: "Filter by department (e.g., 'Cardiology', 'Orthopedics')",
                },
                period: {
                    type: "string",
                    description: "Filter by time period (e.g., 'Q1 2025', '2024')",
                },
            },
        },
    },
    {
        name: "analyze_lab_trends",
        description: "Analyze trends in laboratory results for specific analytes, providing normal/abnormal rates and stability assessments.",
        inputSchema: {
            type: "object",
            properties: {
                analyte: {
                    type: "string",
                    description: "Specific analyte to analyze (e.g., 'Glucose', 'Hemoglobin')",
                },
            },
        },
    },
    {
        name: "get_operational_metrics",
        description: "Get hospital operational performance metrics including length of stay, bed occupancy, ED wait times, and left-without-being-seen rates.",
        inputSchema: {
            type: "object",
            properties: {
                department: {
                    type: "string",
                    description: "Filter by department",
                },
                period: {
                    type: "string",
                    description: "Filter by time period",
                },
            },
        },
    },
    {
        name: "analyze_patient_flow",
        description: "Analyze patient movement through hospital units, tracking admissions, discharges, and transfers to identify bottlenecks.",
        inputSchema: {
            type: "object",
            properties: {
                unit: {
                    type: "string",
                    description: "Specific unit to analyze flow for",
                },
            },
        },
    },
    {
        name: "get_financial_metrics",
        description: "Get hospital financial metrics including estimated revenue per patient day, cost per case, and operating margins.",
        inputSchema: {
            type: "object",
            properties: {
                department: {
                    type: "string",
                    description: "Filter by department",
                },
                period: {
                    type: "string",
                    description: "Filter by time period",
                },
            },
        },
    },
    {
        name: "analyze_readmission_risk",
        description: "Analyze readmission risk across the patient population, categorized by risk level.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "track_care_gaps",
        description: "Identify gaps in care based on standard protocols (e.g., missing hypertension screenings).",
        inputSchema: {
            type: "object",
            properties: {
                department: {
                    type: "string",
                    description: "Filter by department",
                },
            },
        },
    },
    {
        name: "get_clinical_quality_measures",
        description: "Calculate Clinical Quality Measures (CQMs) such as Sepsis Bundle Compliance.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "calculate_medication_adherence",
        description: "Calculate medication adherence rates based on administration records vs scheduled times.",
        inputSchema: {
            type: "object",
            properties: {
                unit: {
                    type: "string",
                    description: "Filter by unit",
                },
            },
        },
    },
    {
        name: "predict_inventory_shortages",
        description: "Predict pharmacy inventory shortages based on current stock levels and usage trends.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "monitor_opioid_stewardship",
        description: "Monitor opioid usage metrics and stewardship across the facility.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "analyze_access_logs",
        description: "Analyze system access logs for potential compliance violations.",
        inputSchema: {
            type: "object",
            properties: {
                start_date: {
                    type: "string",
                    description: "Start date for analysis (YYYY-MM-DD)",
                },
                end_date: {
                    type: "string",
                    description: "End date for analysis (YYYY-MM-DD)",
                },
            },
        },
    },
    {
        name: "detect_vip_snooping",
        description: "Detect potential VIP snooping incidents where staff access high-profile records without assignment.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "monitor_break_glass",
        description: "Monitor 'Break Glass' emergency access events.",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "get_inventory_dashboard",
        description: "Get real-time supply chain dashboard including pharmacy status, general inventory, and recent orders.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "search_vendor_catalog",
        description: "List approved vendors for hospital supplies and pharmaceuticals.",
        inputSchema: {
            type: "object",
            properties: {
                type: { type: "string", description: "Filter by vendor type (Pharmaceutical, MedSurg, Hotel Services)" },
            },
        },
    },
];

// Initialize server
const server = new Server(
    {
        name: "hospital-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: TOOL_DEFINITIONS,
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;

        if (name === "list_patients") {
            const limit = args?.limit ? Number(args.limit) : 20;
            const offset = args?.offset ? Number(args.offset) : 0;
            const result = await listPatients(limit, offset);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "read_patient_record") {
            const patientId = String(args?.patient_id);
            const result = await readPatientRecord(patientId);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_emergency_contacts") {
            const patientId = String(args?.patient_id);
            const result = await getEmergencyContacts(patientId);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "identify_critical_patients") {
            const query = {
                unit: args?.unit ? String(args.unit) : undefined,
                min_acuity_score: args?.min_acuity_score ? Number(args.min_acuity_score) : undefined,
                include_stable: args?.include_stable ? Boolean(args.include_stable) : false,
            };
            const result = await identifyCriticalPatients(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_patient_risk_profile") {
            const patientId = String(args?.patient_id);
            const result = await getPatientRiskProfile(patientId);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "analyze_unit_acuity") {
            const unitName = String(args?.unit_name);
            const result = await analyzeUnitAcuity(unitName);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_clinical_metrics") {
            const query = {
                department: args?.department ? String(args.department) : undefined,
                period: args?.period ? String(args.period) : undefined,
            };
            const result = await getClinicalMetrics(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "analyze_lab_trends") {
            const query = {
                analyte: args?.analyte ? String(args.analyte) : undefined,
            };
            const result = await analyzeLabTrends(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_operational_metrics") {
            const query = {
                department: args?.department ? String(args.department) : undefined,
                period: args?.period ? String(args.period) : undefined,
            };
            const result = await getOperationalMetrics(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "analyze_patient_flow") {
            const query = {
                unit: args?.unit ? String(args.unit) : undefined,
            };
            const result = await analyzePatientFlow(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_financial_metrics") {
            const query = {
                department: args?.department ? String(args.department) : undefined,
                period: args?.period ? String(args.period) : undefined,
            };
            const result = await getFinancialMetrics(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "analyze_readmission_risk") {
            const result = await analyzeReadmissionRisk();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "track_care_gaps") {
            const query = {
                department: args?.department ? String(args.department) : undefined,
            };
            const result = await trackCareGaps(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_clinical_quality_measures") {
            const result = await calculateClinicalQualityMeasures();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "calculate_medication_adherence") {
            const query = {
                unit: args?.unit ? String(args.unit) : undefined,
            };
            const result = await calculateMedicationAdherence(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "predict_inventory_shortages") {
            const result = await predictInventoryShortages();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "monitor_opioid_stewardship") {
            const result = await monitorOpioidStewardship();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "analyze_access_logs") {
            const query = {
                start_date: args?.start_date ? String(args.start_date) : undefined,
                end_date: args?.end_date ? String(args.end_date) : undefined,
            };
            const result = await analyzeAccessLogs(query);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "detect_vip_snooping") {
            const result = await detectVIPSnooping();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "monitor_break_glass") {
            const result = await monitorBreakGlass();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "get_inventory_dashboard") {
            const result = await getInventoryDashboard();
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        if (name === "search_vendor_catalog") {
            const result = await searchVendorCatalog(args?.type as string);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }

        throw new Error(`Tool not found: ${name}`);
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

// Start server
async function run() {
    // Initialize analytics engine
    console.error("Initializing Hospital Analytics Engine...");
    await analyticsEngine.initialize();
    console.error("Analytics Engine initialized successfully");

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Hospital MCP Server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
