#!/bin/bash

# ShopOS Development Environment Startup Script
# Runs both backend and frontend with enhanced logging

set -e

echo "🚀 Starting ShopOS Development Environment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create logs directory
LOGS_DIR="./logs"
mkdir -p "$LOGS_DIR"

# Timestamp for log files
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKEND_LOG="$LOGS_DIR/backend_$TIMESTAMP.log"
FRONTEND_LOG="$LOGS_DIR/frontend_$TIMESTAMP.log"

echo -e "${BLUE}📁 Logs will be saved to:${NC}"
echo -e "   Backend:  ${CYAN}$BACKEND_LOG${NC}"
echo -e "   Frontend: ${CYAN}$FRONTEND_LOG${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# Start backend server
echo -e "${GREEN}🔧 Starting Backend Server...${NC}"
cd packages/opencode
bun run dev 2>&1 | tee "../../$BACKEND_LOG" | sed "s/^/[BACKEND] /" &
BACKEND_PID=$!
cd ../..

sleep 3

# Start frontend server
echo -e "${GREEN}🌐 Starting Frontend Server...${NC}"
cd packages/app
npm run dev 2>&1 | tee "../../$FRONTEND_LOG" | sed "s/^/[FRONTEND] /" &
FRONTEND_PID=$!
cd ../..

sleep 2

echo ""
echo -e "${GREEN}✅ Both servers started!${NC}"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo -e "   Backend PID:  ${MAGENTA}$BACKEND_PID${NC}"
echo -e "   Frontend PID: ${MAGENTA}$FRONTEND_PID${NC}"
echo ""
echo -e "${CYAN}🌍 Application URLs:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:4096${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   • Logs are being saved to ${CYAN}$LOGS_DIR/${NC}"
echo -e "   • Press ${RED}Ctrl+C${NC} to stop both servers"
echo -e "   • View logs live: ${CYAN}tail -f $BACKEND_LOG${NC}"
echo -e "   • Open DevTools in browser for frontend console logs"
echo ""
echo -e "${BLUE}📝 Watching logs (Ctrl+C to stop)...${NC}"
echo ""

# Wait for processes
wait
