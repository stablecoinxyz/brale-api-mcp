#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { BraleAPIClient } from './client.js';
import { logger } from './logger.js';
import * as dotenv from 'dotenv';

// Load environment variables - ensure we look in the project root
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

dotenv.config({ path: join(projectRoot, '.env') });

// Load environment variables and start server

class BraleAPIServer {
  private server: Server;
  private braleClient: BraleAPIClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'brale-api-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'brale_get_accounts',
            description: 'Retrieve all accounts from Brale API',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          {
            name: 'brale_get_account',
            description: 'Retrieve a specific account by ID from Brale API',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account to retrieve',
                },
              },
              required: ['account_id'],
            },
          },
          {
            name: 'brale_get_transfers',
            description: 'Retrieve all transfers for a specific account',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account to get transfers for',
                },
              },
              required: ['account_id'],
            },
          },
          {
            name: 'brale_get_transfer',
            description: 'Retrieve a specific transfer by ID',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                transfer_id: {
                  type: 'string',
                  description: 'The ID of the transfer to retrieve',
                },
              },
              required: ['account_id', 'transfer_id'],
            },
          },
          {
            name: 'brale_get_addresses',
            description: 'Retrieve all addresses for a specific account',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account to get addresses for',
                },
              },
              required: ['account_id'],
            },
          },
          {
            name: 'brale_get_address_balances',
            description: 'Retrieve balances for a specific address',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                address_id: {
                  type: 'string',
                  description: 'The ID of the address',
                },
                transfer_type: {
                  type: 'string',
                  description: 'The blockchain environment (e.g., Solana, Ethereum)',
                },
                value_type: {
                  type: 'string',
                  description: 'The stablecoin token or currency code',
                },
              },
              required: ['account_id', 'address_id', 'transfer_type', 'value_type'],
            },
          },
          {
            name: 'brale_configure',
            description: 'Configure the Brale API client with authentication credentials. Use either bearer_token or client credentials from environment variables.',
            inputSchema: {
              type: 'object',
              properties: {
                base_url: {
                  type: 'string',
                  description: 'The base URL for the Brale API (default: https://api.brale.xyz)',
                  default: 'https://api.brale.xyz',
                },
                bearer_token: {
                  type: 'string',
                  description: 'The Bearer token for authentication (optional if using client credentials from .env)',
                },
                use_env_credentials: {
                  type: 'boolean',
                  description: 'Use BRALE_CLIENT_ID and BRALE_CLIENT_SECRET from environment variables for OAuth2 authentication',
                  default: true,
                },
              },
              required: [],
            },
          },
          {
            name: 'brale_auto_configure',
            description: 'Automatically configure the Brale API client using environment variables (BRALE_CLIENT_ID and BRALE_CLIENT_SECRET)',
            inputSchema: {
              type: 'object',
              properties: {
                base_url: {
                  type: 'string',
                  description: 'The base URL for the Brale API (default: https://api.brale.xyz)',
                  default: 'https://api.brale.xyz',
                },
              },
              required: [],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      logger.debug('Received tool request', { tool: name, args });

      try {
        switch (name) {
          case 'brale_configure':
            return await this.handleConfigure(args);
          case 'brale_auto_configure':
            return await this.handleAutoConfigure(args);
          case 'brale_get_accounts':
            return await this.handleGetAccounts();
          case 'brale_get_account':
            return await this.handleGetAccount(args);
          case 'brale_get_transfers':
            return await this.handleGetTransfers(args);
          case 'brale_get_transfer':
            return await this.handleGetTransfer(args);
          case 'brale_get_addresses':
            return await this.handleGetAddresses(args);
          case 'brale_get_address_balances':
            return await this.handleGetAddressBalances(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        logger.error('Tool execution failed', { tool: name, error: error instanceof Error ? error.message : String(error) });
        if (error instanceof McpError) {
          throw error;
        }
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${errorMessage}`
        );
      }
    });
  }

  private async handleConfigure(args: any) {
    const baseURL = args.base_url || 'https://api.brale.xyz';
    const bearerToken = args.bearer_token;
    const useEnvCredentials = args.use_env_credentials !== false; // Default to true

    let authMethod = '';

    if (bearerToken) {
      // Use provided bearer token
      this.braleClient = new BraleAPIClient({
        baseURL,
        bearerToken,
      });
      authMethod = 'Bearer token';
    } else if (useEnvCredentials) {
      // Use client credentials from environment variables
      const clientId = process.env.BRALE_CLIENT_ID;
      const clientSecret = process.env.BRALE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `BRALE_CLIENT_ID and BRALE_CLIENT_SECRET environment variables are required when using OAuth2 client credentials. Please set them in your .env file. Currently loaded: ID=${clientId ? 'SET' : 'MISSING'}, SECRET=${clientSecret ? 'SET' : 'MISSING'}`
        );
      }

      this.braleClient = new BraleAPIClient({
        baseURL,
        clientId,
        clientSecret,
      });
      authMethod = 'OAuth2 client credentials';
    } else {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Either bearer_token must be provided or use_env_credentials must be true with BRALE_CLIENT_ID and BRALE_CLIENT_SECRET set in environment variables.'
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: `Brale API client configured successfully with base URL: ${baseURL} using ${authMethod}`,
        },
      ],
    };
  }

  private async handleAutoConfigure(args: any) {
    const baseURL = args.base_url || 'https://api.brale.xyz';
    
    // Use client credentials from environment variables
    const clientId = process.env.BRALE_CLIENT_ID;
    const clientSecret = process.env.BRALE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'BRALE_CLIENT_ID and BRALE_CLIENT_SECRET environment variables are required. Please set them in your .env file:\n\nBRALE_CLIENT_ID="your_client_id_here"\nBRALE_CLIENT_SECRET="your_client_secret_here"'
      );
    }

    this.braleClient = new BraleAPIClient({
      baseURL,
      clientId,
      clientSecret,
    });

    return {
      content: [
        {
          type: 'text',
          text: `Brale API client automatically configured with OAuth2 client credentials from environment variables. Base URL: ${baseURL}`,
        },
      ],
    };
  }

  private ensureConfigured(): void {
    if (!this.braleClient) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        'Brale API client not configured. Please run brale_configure first.'
      );
    }
  }

  private async handleGetAccounts() {
    this.ensureConfigured();
    const accounts = await this.braleClient!.getAccounts();
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${accounts.length} accounts:\n${JSON.stringify(accounts, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAccount(args: any) {
    this.ensureConfigured();
    const { account_id } = args;
    
    if (!account_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id is required');
    }

    const account = await this.braleClient!.getAccount(account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Account details:\n${JSON.stringify(account, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetTransfers(args: any) {
    this.ensureConfigured();
    const { account_id } = args;
    
    if (!account_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id is required');
    }

    const transfers = await this.braleClient!.getTransfers(account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${transfers.length} transfers for account ${account_id}:\n${JSON.stringify(transfers, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetTransfer(args: any) {
    this.ensureConfigured();
    const { account_id, transfer_id } = args;
    
    if (!account_id || !transfer_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id and transfer_id are required');
    }

    const transfer = await this.braleClient!.getTransfer(account_id, transfer_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Transfer details:\n${JSON.stringify(transfer, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAddresses(args: any) {
    this.ensureConfigured();
    const { account_id } = args;
    
    if (!account_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id is required');
    }

    const addressesResponse = await this.braleClient!.getAddresses(account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved addresses for account ${account_id}:\n${JSON.stringify(addressesResponse, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAddressBalances(args: any) {
    logger.debug('handleGetAddressBalances called', args);
    this.ensureConfigured();
    const { account_id, address_id, transfer_type, value_type } = args;
    
    if (!account_id || !address_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id and address_id are required');
    }

    logger.debug('Calling getAddressBalances', {
      account_id,
      address_id,
      transfer_type,
      value_type
    });

    const balances = await this.braleClient!.getAddressBalances(account_id, address_id, transfer_type, value_type);
    
    logger.debug('Balance response received', balances);
    
    return {
      content: [
        {
          type: 'text',
          text: `Address balances:\n${JSON.stringify(balances, null, 2)}`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Brale API MCP server started on stdio');
    // Note: No console output here as it interferes with MCP JSON protocol
  }
}

const server = new BraleAPIServer();
server.run().catch(console.error);
