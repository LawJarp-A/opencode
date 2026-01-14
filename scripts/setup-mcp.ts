#!/usr/bin/env bun
import { $ } from "bun"
import { existsSync } from "fs"
import { resolve } from "path"

  const MCP_SERVERS = [
    {
      name: "ShopifyMockMCP",
      path: "/tmp/ShopifyMockMCP",
      repo: "https://github.com/ramakay/ShopifyMockMCP.git",
      description: "Mock.shop Storefront API MCP server",
    type: "node",
    },
    {
      name: "HydrogenMCP",
      path: "/tmp/HydrogenMCP",
      repo: "https://github.com/ramakay/ShopifyMockMCP.git",
      description: "Hydrogen Demo Store MCP server",
    type: "node",
  },
  {
    name: "AmazonMCP",
    path: "mcps/amazon-mcp",
    repo: "", // Local server, no repo
    description: "Amazon Products Scraper MCP server",
    type: "python",
    },
  ]

  async function setupMCPServer(server: typeof MCP_SERVERS[0]): Promise<boolean> {
    const serverExists = existsSync(`${server.path}/dist/server.js`)

    if (serverExists) {
      console.log(`✓ ${server.name} already configured`)
      return true
    }

    console.log(`\n📦 Setting up ${server.name}...`)
    console.log(`   ${server.description}`)

    try {
      const dirExists = existsSync(server.path)

      if (!dirExists) {
        console.log(`   → Cloning repository...`)
        await $`git clone --depth 1 ${server.repo} ${server.path}`.quiet()
      } else {
        console.log(`   → Directory exists, skipping clone...`)
      }

      console.log(`   → Installing dependencies...`)
      await $`cd ${server.path} && npm install --silent`.quiet()

      console.log(`   → Building server...`)
      await $`cd ${server.path} && npm run build --silent`.quiet()

      const built = existsSync(`${serverPath}/dist/server.js`)
      if (!built) {
        throw new Error(`Build succeeded but dist/server.js not found`)
      }
    } else if (server.type === "python") {
      console.log(`   → Setting up Python environment...`)

      const venvPath = `${serverPath}/.venv`
      if (!existsSync(venvPath)) {
        console.log(`   → Creating virtual environment...`)
        await $`cd ${serverPath} && python3 -m venv .venv`
      }

      console.log(`   → Installing requirements...`)
      await $`${venvPath}/bin/pip install -r ${serverPath}/requirements.txt`

      const pythonExists = existsSync(`${venvPath}/bin/python`)
      if (!pythonExists) {
        throw new Error(`Python executable not found in .venv`)
      }
    }

      console.log(`✓ ${server.name} setup complete`)
      return true
    } catch (error) {
      console.error(`✗ Failed to setup ${server.name}:`, error instanceof Error ? error.message : String(error))
      return false
    }
  }

async function main() {
  console.log("🔧 Checking MCP server dependencies...\n")

  const results = await Promise.all(MCP_SERVERS.map(setupMCPServer))

  const allSuccess = results.every(r => r)

  if (allSuccess) {
    console.log("\n✅ All MCP servers ready\n")
    process.exit(0)
  } else {
    console.error("\n❌ Some MCP servers failed to setup")
    console.error("   Check logs above for details\n")
    process.exit(1)
  }
}

main()
