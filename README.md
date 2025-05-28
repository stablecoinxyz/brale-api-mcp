# Brale API MCP Server

A Model Context Protocol (MCP) server that provides a secure wrapper around the Brale API for stablecoin issuance and orchestration operations.

## Overview

This MCP server enables AI assistants to interact with the Brale API, which supports stablecoin issuance, transfers, account management, and other financial operations. The server supports both Bearer token authentication and OAuth2 client credentials authentication and provides tools for:

- Account management (retrieve accounts and account details)
- Transfer operations (view transfers and transfer details)
- Address management (view addresses and balances)
- Configuration management (secure API authentication)

## Features

- **Secure Authentication**: Supports both Bearer token and OAuth2 client credentials authentication
- **Type Safety**: Built with TypeScript and Zod validation
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **Configuration Management**: Runtime configuration of API credentials
- **Read-Only Operations**: Focuses on safe read operations for data retrieval
- **Comprehensive Debugging**: File-based logging, MCP Inspector integration, and production-ready builds
- **Auto Token Refresh**: Automatic OAuth2 token management with refresh capabilities

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brale-api-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Brale API credentials:
```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:
```
BRALE_CLIENT_ID="your_client_id_here"
BRALE_CLIENT_SECRET="your_client_secret_here"
```

4. The project is ready to run with tsx (no build step needed)

## Usage

### Running the Server

**Production Mode:**
```bash
npm start
# or
npm run prod
```

**Development Mode (with debugging):**
```bash
npm run dev          # Auto-reload with file logging
npm run debug        # Single run with file logging
npm run inspector    # Interactive debugging with MCP Inspector
```

**Utility Scripts:**
```bash
npm run logs         # View debug logs in real-time
npm run clear-logs   # Clear the debug log file
```

All commands use `tsx` to run TypeScript directly without compilation.

### Debugging

This server includes comprehensive debugging capabilities:

- **File-based logging**: Automatic logging to `mcp-debug.log` in development
- **MCP Inspector**: Interactive web interface for testing tools
- **Production mode**: Clean builds with no logging overhead

See [DEBUG.md](DEBUG.md) for detailed debugging instructions.

### Configuration

Before using any Brale API endpoints, you must configure the server with your authentication credentials. You have two options:

#### Option 1: OAuth2 Client Credentials (Recommended)

Set your client credentials in the `.env` file and use auto-configuration:

```javascript
// Automatically configure using environment variables
brale_auto_configure({
  base_url: "https://api.brale.xyz" // optional, defaults to production URL
})
```

#### Option 2: Manual Configuration

You can configure manually with either client credentials or a bearer token:

```javascript
// Configure with client credentials from environment variables
brale_configure({
  use_env_credentials: true, // default: true
  base_url: "https://api.brale.xyz" // optional
})

// Or configure with a direct bearer token
brale_configure({
  bearer_token: "your-bearer-token-here",
  base_url: "https://api.brale.xyz" // optional
})
```

### Available Tools

#### `brale_auto_configure`
Automatically configure the Brale API client using environment variables (BRALE_CLIENT_ID and BRALE_CLIENT_SECRET).

**Parameters:**
- `base_url` (optional): API base URL (defaults to https://api.brale.xyz)

#### `brale_configure`
Configure the Brale API client with authentication credentials. Use either bearer_token or client credentials from environment variables.

**Parameters:**
- `bearer_token` (optional): Your Brale API Bearer token (optional if using client credentials from .env)
- `use_env_credentials` (optional): Use BRALE_CLIENT_ID and BRALE_CLIENT_SECRET from environment variables for OAuth2 authentication (default: true)
- `base_url` (optional): API base URL (defaults to https://api.brale.xyz)

#### `brale_get_accounts`
Retrieve all accounts from the Brale API.

**Parameters:** None

#### `brale_get_account`
Retrieve a specific account by ID.

**Parameters:**
- `account_id` (required): The ID of the account to retrieve

#### `brale_get_transfers`
Retrieve all transfers for a specific account.

**Parameters:**
- `account_id` (required): The ID of the account

#### `brale_get_transfer`
Retrieve a specific transfer by ID.

**Parameters:**
- `account_id` (required): The ID of the account
- `transfer_id` (required): The ID of the transfer

#### `brale_get_addresses`
Retrieve all addresses for a specific account.

**Parameters:**
- `account_id` (required): The ID of the account

#### `brale_get_address_balances`
Retrieve balances for a specific address.

**Parameters:**
- `account_id` (required): The ID of the account
- `address_id` (required): The ID of the address
- `transfer_type` (required): Blockchain environment (e.g., "ethereum", "polygon", "base", "solana")
- `value_type` (required): Stablecoin token or currency code (e.g., "USDC", "SBC")

**Example:**
```javascript
brale_get_address_balances({
  account_id: "2xLccOeZcUEpSmBIhvwIMeHtes4",
  address_id: "2xLcccQBNlB2o3HzIoIQzn1Fy1Q",
  transfer_type: "base",
  value_type: "SBC"
})
```

#### `brale_create_account`
Create a new customer account with KYB details.

**Parameters:**
- `business_name` (required): The business name
- `ein` (required): Employer Identification Number
- `business_type` (required): Type of business (e.g., "Corporation", "LLC")
- `address` (required): Business address object with street_line_1, city, state, zip, country
- `phone_number` (required): Business phone number
- `email` (required): Business email address
- `website` (optional): Business website
- `ultimate_beneficial_owners` (required): Array of UBO objects with name, ssn, and address
- `idempotency_key` (optional): Unique key to prevent duplicate operations (auto-generated if not provided)

#### `brale_create_transfer`
Create a new transfer between accounts, addresses, or financial institutions.

**Parameters:**
- `account_id` (required): The ID of the account
- `amount` (required): Object with value and currency (e.g., {value: "100", currency: "USD"})
- `source` (required): Source endpoint with value_type, transfer_type, and optional address_id/financial_institution_id
- `destination` (required): Destination endpoint with value_type, transfer_type, and optional address_id/financial_institution_id
- `idempotency_key` (optional): Unique key to prevent duplicate operations (auto-generated if not provided)

#### `brale_get_financial_institutions`
Retrieve all financial institutions for a specific account.

**Parameters:**
- `account_id` (required): The ID of the account to get financial institutions for

## PROMPTS

For example prompts and usage patterns, see [PROMPTS.md](PROMPTS.md).

## API Reference

This server wraps the following Brale API endpoints:

- `GET /accounts` - Retrieve all accounts
- `GET /accounts/{id}` - Retrieve a specific account
- `GET /accounts/{account_id}/transfers` - Get transfers for an account
- `GET /accounts/{account_id}/transfers/{id}` - Get a specific transfer
- `GET /accounts/{account_id}/addresses` - Get addresses for an account
- `GET /accounts/{account_id}/addresses/{address_id}/balance` - Get address balance (note: singular "balance")

## Authentication

The Brale API supports two authentication methods:

### OAuth2 Client Credentials (Recommended)

The server can automatically handle OAuth2 authentication using client credentials:

1. Obtain client credentials (Client ID and Client Secret) from Brale
2. Set them in your `.env` file:
   ```
   BRALE_CLIENT_ID="your_client_id_here"
   BRALE_CLIENT_SECRET="your_client_secret_here"
   ```
3. Use `brale_auto_configure` tool to set up authentication
4. The server will automatically:
   - Encode credentials as Base64 (`client_id:client_secret`)
   - Make POST request to `https://auth.brale.xyz/oauth2/token`
   - Handle token refresh when needed (with 5-minute buffer)
   - Include the token in all API requests

### Bearer Token Authentication

Alternatively, you can use a pre-obtained Bearer token:

1. Obtain a Bearer token from Brale (typically through OAuth2 client_credentials flow)
2. Configure the MCP server with your token using the `brale_configure` tool
3. The server will include the token in all API requests as: `Authorization: Bearer <token>`

## Error Handling

The server provides comprehensive error handling:

- **Configuration Errors**: Clear messages when the server isn't configured
- **Authentication Errors**: Proper handling of invalid or expired tokens
- **Validation Errors**: Parameter validation with helpful error messages
- **API Errors**: Forwarding of Brale API error responses
- **MCP Protocol Compliance**: No console output in production to avoid JSON parsing errors

## Security Considerations

- Bearer tokens are stored in memory only and not persisted
- All API communications use HTTPS
- The server only provides read-only operations for safety
- Input validation prevents malformed requests
- Automatic token refresh with secure credential management

## Development

### Project Structure

```
src/
├── types.ts      # TypeScript types and Zod schemas
├── client.ts     # Brale API client implementation
├── server.ts     # MCP server implementation
└── logger.ts     # File-based logging system
```

### Development Workflow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Monitor logs:**
   ```bash
   npm run logs
   ```

3. **Test interactively:**
   ```bash
   npm run inspector
   ```

4. **Test production build:**
   ```bash
   npm run prod
   ```

### Environment Variables

**Development (.env):**
```bash
NODE_ENV=development
MCP_DEBUG=true
BRALE_CLIENT_ID="your_client_id"
BRALE_CLIENT_SECRET="your_client_secret"
```

**Production:**
```bash
NODE_ENV=production
BRALE_CLIENT_ID="your_client_id"
BRALE_CLIENT_SECRET="your_client_secret"
```

## Debugging

For detailed debugging instructions, see [DEBUG.md](DEBUG.md).

### Quick Debug Commands

```bash
# Start with debugging
npm run dev

# View logs
npm run logs

# Interactive testing
npm run inspector

# Clear logs
npm run clear-logs
```

## License

MIT

## Support

For issues related to:
- This MCP server: Create an issue in this repository
- Brale API: Contact Brale support
- MCP Protocol: See the MCP documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Basic account and transfer operations
- Bearer token and OAuth2 client credentials authentication
- Read-only operations for security
- Comprehensive debugging system with file logging and MCP Inspector
- Auto token refresh with 5-minute buffer
- Multi-chain support (Ethereum, Polygon, Base, Solana)
- Production-ready builds with MCP protocol compliance 