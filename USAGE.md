# Brale API MCP Server - Usage Guide

This guide shows you how to use the Brale API MCP server within Cursor and other MCP-compatible applications.

## Prerequisites

1. Install dependencies: `npm install`
2. Set up your `.env` file with Brale credentials:
   ```
   BRALE_CLIENT_ID="your_actual_client_id"
   BRALE_CLIENT_SECRET="your_actual_client_secret"
   ```

## Cursor Integration

### Step 1: Configure MCP Server in Cursor

Add the following configuration to your Cursor MCP settings file:

**File Location:**
- **macOS/Linux:** `~/.cursor/mcp_servers.json`
- **Windows:** `%APPDATA%\Cursor\mcp_servers.json`

**Configuration:**
```json
{
  "brale-api": {
    "command": "npx",
    "args": ["tsx", "/absolute/path/to/your/brale-api-mcp/src/server.ts"],
    "env": {
      "NODE_ENV": "development"
    }
  }
}
```

> **Note:** Replace `/absolute/path/to/your/brale-api-mcp/src/server.ts` with the actual path to your TypeScript server file.

### Step 2: Restart Cursor

After adding the configuration, restart Cursor to load the MCP server.

## Usage Examples

### Example 1: Initial Setup and Authentication

**Prompt:**
```
Please use the brale_auto_configure tool to set up authentication using my environment variables.
```

**What happens:**
- The server loads your `BRALE_CLIENT_ID` and `BRALE_CLIENT_SECRET` from the `.env` file
- Automatically handles OAuth2 authentication with Brale
- Returns confirmation that the client is configured

### Example 2: Get All Accounts

**Prompt:**
```
Now use brale_get_accounts to retrieve all my Brale accounts.
```

**What you'll get:**
- A list of all accounts associated with your Brale credentials
- Account details including IDs, business names, statuses, and contact information

### Example 3: Get Specific Account Details

**Prompt:**
```
Use brale_get_account with account_id "acc_123456789" to get detailed information about that specific account.
```

**What you'll get:**
- Complete account information including:
  - Business details (name, EIN, type)
  - Address information
  - Contact details
  - Ultimate beneficial owners
  - Account status

### Example 4: View Account Transfers

**Prompt:**
```
Get all transfers for account "acc_123456789" using brale_get_transfers.
```

**What you'll get:**
- List of all transfers for the specified account
- Transfer details including:
  - Status and amounts
  - Source and destination information
  - Transfer types and value types
  - Timestamps

### Example 5: Get Specific Transfer Details

**Prompt:**
```
Use brale_get_transfer with account_id "acc_123456789" and transfer_id "txn_987654321" to get detailed transfer information.
```

**What you'll get:**
- Detailed information about the specific transfer
- Complete source and destination details
- Gas fees (if applicable)
- Transfer status and timing

### Example 6: List Account Addresses

**Prompt:**
```
Get all addresses for account "acc_123456789" using brale_get_addresses.
```

**What you'll get:**
- All addresses associated with the account
- Address details including:
  - Address IDs and names
  - Blockchain addresses
  - Supported transfer types
  - Address statuses

### Example 7: Check Address Balances

**Prompt:**
```
For account "acc_123456789", get the balances for address "addr_987654321" using brale_get_address_balances.
```

**Optional with filters:**
```
Get balances for address "addr_987654321" in account "acc_123456789", filtered by transfer_type "Ethereum" and value_type "USDC".
```

**What you'll get:**
- Current balances for the specified address
- Balance information by value type (e.g., USDC, USDT)
- Transfer type information (e.g., Ethereum, Solana)

## Advanced Usage Patterns

### Comprehensive Account Overview

**Prompt:**
```
First configure the Brale API, then get all my accounts. For each account, show me:
1. The account details
2. Total number of transfers
3. All addresses and their balances
```

### Monitoring Specific Account Activity

**Prompt:**
```
For account "acc_123456789":
1. Get the account details
2. List all recent transfers
3. Show balances for all addresses
4. Summarize the account's current financial position
```

### Transfer Analysis

**Prompt:**
```
Analyze the transfer activity for account "acc_123456789":
1. Get all transfers
2. Group them by status
3. Calculate total amounts by value type
4. Identify the most active addresses
```

## Error Handling Examples

### Authentication Issues

If you see authentication errors:
```
The client is not configured. Please use brale_auto_configure first.
```

**Solution:** Run the auto-configure tool first.

### Missing Environment Variables

If you see:
```
BRALE_CLIENT_ID and BRALE_CLIENT_SECRET environment variables are required
```

**Solution:** Check your `.env` file and ensure the credentials are properly set.

### Invalid Account/Transfer IDs

If you see parameter validation errors:
```
account_id is required
```

**Solution:** Ensure you're providing the correct required parameters for each tool.

## Best Practices

### 1. Always Configure First
Start each session by configuring the client:
```
Use brale_auto_configure to set up the Brale API client.
```

### 2. Use Descriptive Prompts
Be specific about what data you want:
```
Get account details for "acc_123456789" and show me the business name, status, and contact email.
```

### 3. Chain Operations Logically
Build complex queries step by step:
```
1. First get all accounts
2. For the first account, get all addresses
3. For each address, show the current balances
```

### 4. Handle Large Datasets
For accounts with many transfers or addresses:
```
Get the first 10 transfers for account "acc_123456789" and summarize their status distribution.
```

## Tool Reference Quick Guide

| Tool | Purpose | Required Parameters | Optional Parameters |
|------|---------|-------------------|-------------------|
| `brale_auto_configure` | Set up OAuth2 auth | None | `base_url` |
| `brale_configure` | Manual configuration | None | `bearer_token`, `use_env_credentials`, `base_url` |
| `brale_get_accounts` | List all accounts | None | None |
| `brale_get_account` | Get specific account | `account_id` | None |
| `brale_get_transfers` | List account transfers | `account_id` | None |
| `brale_get_transfer` | Get specific transfer | `account_id`, `transfer_id` | None |
| `brale_get_addresses` | List account addresses | `account_id` | None |
| `brale_get_address_balances` | Get address balances | `account_id`, `address_id` | `transfer_type`, `value_type` |

## Troubleshooting

### Server Not Found
If Cursor can't find the MCP server:
1. Check the path in your MCP configuration
2. Ensure dependencies are installed (`npm install`)
3. Verify `tsx` is available (`npx tsx --version`)
4. Restart Cursor after configuration changes

### Authentication Failures
1. Verify your `.env` file exists and has the correct credentials
2. Check that your Brale client credentials are valid
3. Ensure the credentials have the necessary permissions

### API Errors
If you receive API errors:
1. Check the Brale API status
2. Verify your account has access to the requested resources
3. Ensure the account/transfer/address IDs are correct

For additional support, refer to the main README.md or contact Brale support for API-related issues. 