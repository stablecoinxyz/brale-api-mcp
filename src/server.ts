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

dotenv.config();

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

  private generateIdempotencyKey(): string {
    return `idemp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
          {
            name: 'brale_create_account',
            description: 'Create a new customer account with KYB details',
            inputSchema: {
              type: 'object',
              properties: {
                business_name: {
                  type: 'string',
                  description: 'The business name',
                },
                ein: {
                  type: 'string',
                  description: 'Employer Identification Number',
                },
                business_type: {
                  type: 'string',
                  description: 'Type of business (e.g., Corporation, LLC)',
                },
                address: {
                  type: 'object',
                  properties: {
                    street_line_1: { type: 'string' },
                    street_line_2: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    zip: { type: 'string' },
                    country: { type: 'string' },
                  },
                  required: ['street_line_1', 'city', 'state', 'zip', 'country'],
                },
                phone_number: {
                  type: 'string',
                  description: 'Business phone number',
                },
                email: {
                  type: 'string',
                  description: 'Business email address',
                },
                website: {
                  type: 'string',
                  description: 'Business website',
                },
                business_controller: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    ssn: { type: 'string' },
                    address: {
                      type: 'object',
                      properties: {
                        street_line_1: { type: 'string' },
                        street_line_2: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zip: { type: 'string' },
                        country: { type: 'string' },
                      },
                      required: ['street_line_1', 'city', 'state', 'zip', 'country'],
                    },
                  },
                  required: ['name', 'ssn', 'address'],
                },
                idempotency_key: {
                  type: 'string',
                  description: 'Unique idempotency key to prevent duplicate operations (optional - will be auto-generated if not provided)',
                },
              },
              required: ['business_name', 'ein', 'business_type', 'address', 'phone_number', 'email', 'business_controller'],
            },
          },
          {
            name: 'brale_create_transfer',
            description: 'Create a new transfer between accounts, addresses, or financial institutions',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                amount: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      description: 'The amount to transfer',
                    },
                    currency: {
                      type: 'string',
                      description: 'The currency code (e.g., USD)',
                    },
                  },
                  required: ['value', 'currency'],
                },
                source: {
                  type: 'object',
                  properties: {
                    value_type: {
                      type: 'string',
                      description: 'Source value type (e.g., USD, USDC)',
                    },
                    transfer_type: {
                      type: 'string',
                      description: 'Source transfer type (e.g., wire, ethereum)',
                    },
                    address_id: {
                      type: 'string',
                      description: 'Source address ID (optional)',
                    },
                    financial_institution_id: {
                      type: 'string',
                      description: 'Source financial institution ID (optional)',
                    },
                  },
                  required: ['value_type', 'transfer_type'],
                },
                destination: {
                  type: 'object',
                  properties: {
                    value_type: {
                      type: 'string',
                      description: 'Destination value type (e.g., USD, USDC)',
                    },
                    transfer_type: {
                      type: 'string',
                      description: 'Destination transfer type (e.g., wire, ethereum)',
                    },
                    address_id: {
                      type: 'string',
                      description: 'Destination address ID (optional)',
                    },
                    financial_institution_id: {
                      type: 'string',
                      description: 'Destination financial institution ID (optional)',
                    },
                  },
                  required: ['value_type', 'transfer_type'],
                },
                idempotency_key: {
                  type: 'string',
                  description: 'Unique idempotency key to prevent duplicate operations (optional - will be auto-generated if not provided)',
                },
              },
              required: ['account_id', 'amount', 'source', 'destination'],
            },
          },
          {
            name: 'brale_get_financial_institutions',
            description: 'Retrieve all financial institutions for a specific account',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account to get financial institutions for',
                },
              },
              required: ['account_id'],
            },
          },
          {
            name: 'brale_get_financial_institution',
            description: 'Retrieve a specific financial institution by ID',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                institution_id: {
                  type: 'string',
                  description: 'The ID of the financial institution to retrieve',
                },
              },
              required: ['account_id', 'institution_id'],
            },
          },
          {
            name: 'brale_create_external_financial_institution',
            description: 'Create a new external financial institution (bank account) for ACH/wire transfers',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                name: {
                  type: 'string',
                  description: 'Name for this financial institution (e.g., "Business Checking Account")',
                },
                transfer_type: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Transfer types supported (e.g., ["ach", "wire"])',
                },
                bank_details: {
                  type: 'object',
                  properties: {
                    owner: {
                      type: 'string',
                      description: 'Account owner name',
                    },
                    account_number: {
                      type: 'string',
                      description: 'Bank account number',
                    },
                    routing_number: {
                      type: 'string',
                      description: 'Bank routing number',
                    },
                    name: {
                      type: 'string',
                      description: 'Bank name',
                    },
                    address: {
                      type: 'object',
                      properties: {
                        street_line_1: { type: 'string' },
                        street_line_2: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zip: { type: 'string' },
                        country: { type: 'string' },
                      },
                      required: ['street_line_1', 'city', 'state', 'zip', 'country'],
                    },
                    account_type: {
                      type: 'string',
                      description: 'Account type (e.g., "checking", "savings")',
                    },
                  },
                  required: ['owner', 'account_number', 'routing_number', 'name', 'address', 'account_type'],
                },
                idempotency_key: {
                  type: 'string',
                  description: 'Unique idempotency key to prevent duplicate operations (optional - will be auto-generated if not provided)',
                },
              },
              required: ['account_id', 'name', 'transfer_type', 'bank_details'],
            },
          },
          {
            name: 'brale_create_external_address',
            description: 'Create a new external address (non-custodial wallet) for the account',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                name: {
                  type: 'string',
                  description: 'Name for this address (e.g., "My MetaMask Wallet")',
                },
                transfer_types: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Blockchain networks supported (e.g., ["ethereum", "polygon", "base"])',
                },
                address: {
                  type: 'string',
                  description: 'The actual blockchain address (e.g., "0x...")',
                },
                idempotency_key: {
                  type: 'string',
                  description: 'Unique idempotency key to prevent duplicate operations (optional - will be auto-generated if not provided)',
                },
              },
              required: ['account_id', 'name', 'transfer_types', 'address'],
            },
          },
          {
            name: 'brale_get_automations',
            description: 'Retrieve all automations for a specific account',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account to get automations for',
                },
              },
              required: ['account_id'],
            },
          },
          {
            name: 'brale_get_automation',
            description: 'Retrieve a specific automation by ID',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                automation_id: {
                  type: 'string',
                  description: 'The ID of the automation to retrieve',
                },
              },
              required: ['account_id', 'automation_id'],
            },
          },
          {
            name: 'brale_create_automation',
            description: 'Create a new automation for automated deposit addresses or onramps',
            inputSchema: {
              type: 'object',
              properties: {
                account_id: {
                  type: 'string',
                  description: 'The ID of the account',
                },
                name: {
                  type: 'string',
                  description: 'Name for this automation (e.g., "Customer Onramp")',
                },
                destination_address: {
                  type: 'object',
                  properties: {
                    address_id: {
                      type: 'string',
                      description: 'The destination address ID',
                    },
                    value_type: {
                      type: 'string',
                      description: 'The token type (e.g., "SBC", "USDC")',
                    },
                    transfer_type: {
                      type: 'string',
                      description: 'The blockchain network (e.g., "ethereum", "base")',
                    },
                  },
                  required: ['address_id', 'value_type', 'transfer_type'],
                },
                idempotency_key: {
                  type: 'string',
                  description: 'Unique idempotency key to prevent duplicate operations (optional - will be auto-generated if not provided)',
                },
              },
              required: ['account_id', 'name', 'destination_address'],
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
          case 'brale_create_account':
            return await this.handleCreateAccount(args);
          case 'brale_create_transfer':
            return await this.handleCreateTransfer(args);
          case 'brale_get_financial_institutions':
            return await this.handleGetFinancialInstitutions(args);
          case 'brale_get_financial_institution':
            return await this.handleGetFinancialInstitution(args);
          case 'brale_create_external_financial_institution':
            return await this.handleCreateExternalFinancialInstitution(args);
          case 'brale_create_external_address':
            return await this.handleCreateExternalAddress(args);
          case 'brale_get_automations':
            return await this.handleGetAutomations(args);
          case 'brale_get_automation':
            return await this.handleGetAutomation(args);
          case 'brale_create_automation':
            return await this.handleCreateAutomation(args);
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
    const accountIds = await this.braleClient!.getAccounts();
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${accountIds.length} account(s):\n${JSON.stringify(accountIds, null, 2)}`,
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

  private async handleCreateAccount(args: any) {
    this.ensureConfigured();
    const { business_name, ein, business_type, address, phone_number, email, website, business_controller, idempotency_key } = args;
    
    if (!business_name || !ein || !business_type || !address || !phone_number || !email || !business_controller) {
      throw new McpError(ErrorCode.InvalidParams, 'business_name, ein, business_type, address, phone_number, email, and business_controller are required');
    }

    const accountData = {
      business_name,
      ein,
      business_type,
      address,
      phone_number,
      email,
      website,
      business_controller,
    };

    const idempotencyKeyToUse = idempotency_key || this.generateIdempotencyKey();
    const account = await this.braleClient!.createAccount(accountData, idempotencyKeyToUse);
    
    return {
      content: [
        {
          type: 'text',
          text: `Account created successfully:\n${JSON.stringify(account, null, 2)}`,
        },
      ],
    };
  }

  private async handleCreateTransfer(args: any) {
    this.ensureConfigured();
    const { account_id, amount, source, destination, idempotency_key } = args;
    
    if (!account_id || !amount || !source || !destination) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id, amount, source, and destination are required');
    }

    const transferData = {
      amount,
      source,
      destination,
    };

    const idempotencyKeyToUse = idempotency_key || this.generateIdempotencyKey();
    const transfer = await this.braleClient!.createTransfer(account_id, transferData, idempotencyKeyToUse);
    
    return {
      content: [
        {
          type: 'text',
          text: `Transfer created successfully:\n${JSON.stringify(transfer, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetFinancialInstitutions(args: any) {
    this.ensureConfigured();
    const { account_id } = args;
    
    if (!account_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id is required');
    }

    const institutionsResponse = await this.braleClient!.getFinancialInstitutions(account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${institutionsResponse.financial_institutions.length} financial institutions for account ${account_id}:\n${JSON.stringify(institutionsResponse, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetFinancialInstitution(args: any) {
    this.ensureConfigured();
    const { account_id, institution_id } = args;
    
    if (!account_id || !institution_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id and institution_id are required');
    }

    const institution = await this.braleClient!.getFinancialInstitution(account_id, institution_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Financial institution details:\n${JSON.stringify(institution, null, 2)}`,
        },
      ],
    };
  }

  private async handleCreateExternalFinancialInstitution(args: any) {
    this.ensureConfigured();
    const { account_id, name, transfer_type, bank_details, idempotency_key } = args;
    
    if (!account_id || !name || !transfer_type || !bank_details) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id, name, transfer_type, and bank_details are required');
    }

    const financialInstitutionData = {
      name,
      transfer_type,
      bank_details,
    };

    const idempotencyKeyToUse = idempotency_key || this.generateIdempotencyKey();
    const financialInstitution = await this.braleClient!.createExternalFinancialInstitution(account_id, financialInstitutionData, idempotencyKeyToUse);
    
    return {
      content: [
        {
          type: 'text',
          text: `Financial institution created successfully:\n${JSON.stringify(financialInstitution, null, 2)}`,
        },
      ],
    };
  }

  private async handleCreateExternalAddress(args: any) {
    this.ensureConfigured();
    const { account_id, name, transfer_types, address, idempotency_key } = args;
    
    if (!account_id || !name || !transfer_types || !address) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id, name, transfer_types, and address are required');
    }

    const externalAddressData = {
      name,
      transfer_types,
      address,
    };

    const idempotencyKeyToUse = idempotency_key || this.generateIdempotencyKey();
    const externalAddress = await this.braleClient!.createExternalAddress(account_id, externalAddressData, idempotencyKeyToUse);
    
    return {
      content: [
        {
          type: 'text',
          text: `External address created successfully:\n${JSON.stringify(externalAddress, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAutomations(args: any) {
    this.ensureConfigured();
    const { account_id } = args;
    
    if (!account_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id is required');
    }

    const automationsResponse = await this.braleClient!.getAutomations(account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${automationsResponse.automations.length} automations for account ${account_id}:\n${JSON.stringify(automationsResponse, null, 2)}`,
        },
      ],
    };
  }

  private async handleGetAutomation(args: any) {
    this.ensureConfigured();
    const { account_id, automation_id } = args;
    
    if (!account_id || !automation_id) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id and automation_id are required');
    }

    const automation = await this.braleClient!.getAutomation(account_id, automation_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Automation details:\n${JSON.stringify(automation, null, 2)}`,
        },
      ],
    };
  }

  private async handleCreateAutomation(args: any) {
    this.ensureConfigured();
    const { account_id, name, destination_address, idempotency_key } = args;
    
    if (!account_id || !name || !destination_address) {
      throw new McpError(ErrorCode.InvalidParams, 'account_id, name, and destination_address are required');
    }

    const automationData = {
      name,
      destination_address,
    };

    const idempotencyKeyToUse = idempotency_key || this.generateIdempotencyKey();
    const automation = await this.braleClient!.createAutomation(account_id, automationData, idempotencyKeyToUse);
    
    return {
      content: [
        {
          type: 'text',
          text: `Automation created successfully:\n${JSON.stringify(automation, null, 2)}`,
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
