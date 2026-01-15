/**
 * Enhanced Logger
 * 
 * Provides structured logging with timestamps and context
 * Works for both frontend and backend
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
    component?: string
    action?: string
    sessionID?: string
    [key: string]: any
}

class Logger {
    private component: string

    constructor(component: string) {
        this.component = component
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext) {
        const timestamp = new Date().toISOString()
        const contextStr = context ? ` | ${JSON.stringify(context)}` : ""
        return `[${timestamp}] [${level.toUpperCase()}] [${this.component}] ${message}${contextStr}`
    }

    debug(message: string, context?: LogContext) {
        console.debug(this.formatMessage("debug", message, context))
    }

    info(message: string, context?: LogContext) {
        console.log(this.formatMessage("info", message, context))
    }

    warn(message: string, context?: LogContext) {
        console.warn(this.formatMessage("warn", message, context))
    }

    error(message: string, error?: Error | any, context?: LogContext) {
        const errorContext = error ? {
            ...context,
            error: error.message || String(error),
            stack: error.stack
        } : context
        console.error(this.formatMessage("error", message, errorContext))
    }

    // Specialized loggers for common patterns

    apiCall(method: string, url: string, status?: number) {
        this.info(`API ${method} ${url}`, { status })
    }

    wsEvent(eventType: string, data?: any) {
        this.info(`WebSocket event: ${eventType}`, { data })
    }

    stateChange(from: string, to: string, context?: LogContext) {
        this.info(`State change: ${from} → ${to}`, context)
    }

    sessionEvent(sessionID: string, event: string, context?: LogContext) {
        this.info(`Session event: ${event}`, { sessionID, ...context })
    }
}

/**
 * Create a logger instance for a component
 * 
 * Usage:
 * const log = createLogger("ActionDashboard")
 * log.info("User submitted prompt", { actionType: "marketing" })
 */
export function createLogger(component: string): Logger {
    return new Logger(component)
}

// Pre-configured loggers for common components
export const BackendLogger = createLogger("Backend")
export const FrontendLogger = createLogger("Frontend")
export const ClientLogger = createLogger("OpenCodeClient")
export const ExecutionLogger = createLogger("Execution")
