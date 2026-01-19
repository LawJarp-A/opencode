#!/bin/bash
cd '/Users/gg/Documents/ShopOS/Reddit MCP/reddit-mcp-gg'
export REDDIT_CLIENT_ID='wwEXofDq3XsulyNYmdZRrw'
export REDDIT_CLIENT_SECRET='BX_A3WJeufqrc6jltrSXH6NUQ6oNvg'
export REDDIT_USERNAME='YOUR_USERNAME_HERE'
export REDDIT_PASSWORD='YOUR_PASSWORD_HERE'
export REDDIT_USER_AGENT='ShopOS_MCP_Agent'
/Users/gg/.local/bin/uv run server.py
