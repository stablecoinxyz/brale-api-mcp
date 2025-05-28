# Brale API MCP Server - Example Prompts

This document contains example prompts you can use with the Brale API MCP server in Cursor or other AI assistants. These prompts demonstrate how to interact with the various tools available in the server.

## Configuration

### Auto-configure with environment variables
```
Configure the Brale API client using environment variables
```

### Manual configuration with bearer token
```
Configure the Brale API client with my bearer token
```

### Manual configuration with client credentials
```
Configure the Brale API client using client credentials from environment variables
```

## Account Management

### Create a new customer account
```
Create a new Brale account for "TechCorp LLC" with EIN "12-3456789", business type "LLC", located at "123 Tech Street, San Francisco, CA 94105, USA", phone "415-555-0123", email "admin@techcorp.com", website "techcorp.com", with John Doe (SSN: 123-45-6789) as the business controller at the same address.
```

### Create account with multiple UBOs
```
Create a Brale account for "StartupCo Inc" with EIN "98-7654321", business type "Corporation", located at "456 Innovation Ave, Austin, TX 78701, USA", phone "512-555-0199", email "legal@startupco.com", website "startupco.com", with two ultimate beneficial owners:
1. Jane Smith (SSN: 987-65-4321) at 789 Oak St, Austin, TX 78702, USA
2. Bob Johnson (SSN: 456-78-9012) at 321 Pine St, Austin, TX 78703, USA
```

### Get all accounts
```
Show me all Brale accounts
```

### Get specific account details
```
Get details for Brale account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

## Transfer Operations

### Create a simple transfer
```
Create a transfer for account "2xLccOeZcUEpSmBIhvwIMeHtes4" to move $100 USD from wire transfer to USDC on Ethereum address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q"
```

### Create a cross-chain transfer
```
Create a transfer for account "2xLccOeZcUEpSmBIhvwIMeHtes4" to convert $500 USDC from Ethereum to SBC on Base network using address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q"
```

### Create a bank to crypto transfer
```
Create a transfer for account "2xLccOeZcUEpSmBIhvwIMeHtes4" to move $1000 USD from my linked bank account (financial institution ID "bank_id_here") to USDC on Polygon address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q"
```

### View all transfers
```
Show me all transfers for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Get transfer details
```
Get details for transfer "transfer_id_here" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

## Address and Balance Management

### View account addresses
```
Show me all addresses for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Check specific balance
```
Check the USDC balance on Ethereum for address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Check SBC balance on Base
```
Check the SBC balance on Base network for address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Multi-chain balance check
```
Check my USDC balances across Ethereum, Polygon, and Base networks for address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Portfolio analysis
```
Analyze my crypto portfolio for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Get all addresses
2. Check balances for USDC on Ethereum, Polygon, and Base
3. Check SBC balances on Base
4. Summarize total holdings by token type
```

### Complete portfolio overview
```
Give me a complete portfolio overview for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. List all addresses and their supported networks
2. Check balances for all major stablecoins (USDC, SBC) across all networks
3. Calculate total portfolio value
4. Show distribution by token and network
```

## Financial Institution Management

### View financial institutions
```
Show me all financial institutions linked to account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Get specific financial institution details
```
Get details for financial institution "institution_id_here" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

## Complex Workflows

### Complete onboarding workflow
```
Help me set up a complete Brale account:
1. Configure the API client
2. Create a new business account for "StartupCo Inc"
3. Set up addresses for Ethereum and Base networks
4. Link a bank account for ACH transfers
5. Show me the account summary
```

### Stablecoin conversion workflow
```
Help me convert fiat to stablecoins:
1. Check my current account balances
2. Create a transfer to convert $1000 USD from my bank to USDC on Ethereum
3. Monitor the transfer status
4. Show my updated balances
```

### Multi-chain arbitrage analysis
```
Analyze arbitrage opportunities for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Check USDC prices/balances across Ethereum, Polygon, and Base
2. Check SBC balances on Base
3. Identify potential arbitrage opportunities
4. Suggest optimal transfer strategies
```

### Monthly portfolio report
```
Generate a monthly portfolio report for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Get all addresses and their balances
2. List all transfers from the past month
3. Calculate net inflows/outflows by token type
4. Show portfolio performance and allocation
```

### Risk management check
```
Perform a risk management check for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Check balances across all networks
2. Identify concentration risks (too much in one token/network)
3. Review recent transfer patterns
4. Suggest diversification strategies
```

### Compliance audit
```
Prepare compliance documentation for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Get account details and KYB status
2. List all linked financial institutions
3. Show all addresses and their transaction history
4. Generate a compliance summary report
```

## Troubleshooting and Diagnostics

### Connection test
```
Test my Brale API connection and show account status
```

### Balance discrepancy investigation
```
Investigate balance discrepancies for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Check all address balances
2. Review recent transfers
3. Identify any pending or failed transactions
4. Provide reconciliation report
```

### Network status check
```
Check the status of all blockchain networks for account "2xLccOeZcUEpSmBIhvwIMeHtes4" and report any issues with balances or connectivity
```

## Advanced Use Cases

### DeFi integration planning
```
Help me plan DeFi integration for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Show current stablecoin holdings
2. Identify which networks have the most liquidity
3. Suggest optimal allocation for yield farming
4. Plan transfer strategy to move funds to target networks
```

### Treasury management
```
Perform treasury management analysis for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Show current cash and stablecoin positions
2. Analyze historical transfer patterns
3. Identify optimal cash management strategies
4. Suggest automation opportunities
```

### Cross-border payment setup
```
Set up cross-border payment infrastructure for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Review current addresses and supported networks
2. Identify optimal stablecoin and network combinations for different regions
3. Plan transfer routes for major corridors
4. Estimate costs and settlement times
```

## Tips for Effective Prompts

1. **Be specific**: Include exact account IDs, address IDs, and amounts
2. **Use real data**: Reference actual accounts and addresses you have access to
3. **Combine operations**: Ask for multi-step workflows to accomplish complex tasks
4. **Request summaries**: Ask for analysis and insights, not just raw data
5. **Include context**: Mention your business goals or use case for better recommendations
6. **Error handling**: Ask the AI to check for errors and suggest solutions
7. **Validation**: Request confirmation of important operations before execution

## Security Reminders

- Never include real SSNs, account numbers, or sensitive data in prompts
- Use placeholder values for examples
- Always verify account IDs and addresses before executing transfers
- Review all transfer details before confirmation
- Keep idempotency keys secure and unique 