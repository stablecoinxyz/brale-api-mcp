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

### View all accounts
```
Show me all my Brale accounts
```

### Get account details
```
Get details for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Create new business account
```
Create a new Brale account for TechCorp LLC:
- Business name: TechCorp LLC
- EIN: 12-3456789
- Business type: LLC
- Address: 123 Tech Street, San Francisco, CA 94105, USA
- Phone: +1-555-123-4567
- Email: finance@techcorp.com
- Website: https://techcorp.com
- Business controller: John Smith, SSN 123-45-6789, address 456 Main St, San Francisco, CA 94102, USA
```

### Create corporation account
```
Set up a Brale account for my corporation:
- Business: Innovative Solutions Corp
- EIN: 98-7654321
- Type: Corporation
- Address: 789 Innovation Blvd, Suite 100, Austin, TX 73301, USA
- Phone: (512) 555-0123
- Email: accounting@innovativesolutions.com
- Controller: Jane Doe, SSN 987-65-4321, same business address
```

### Create corporation account with business controller
```
Create a Brale account for "StartupCo Inc" with EIN "98-7654321", business type "Corporation", located at "456 Innovation Ave, Austin, TX 78701, USA", phone "512-555-0199", email "legal@startupco.com", website "startupco.com", with business controller Jane Smith (SSN: 987-65-4321) at 789 Oak St, Austin, TX 78702, USA
```

## Transfer Operations

### View transfers
```
Show me all transfers for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Get specific transfer
```
Get details for transfer "transfer_id_here" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Create transfer from bank to crypto
```
Create a transfer for account "2xLccOeZcUEpSmBIhvwIMeHtes4" of $100 USD from financial institution "bank_id_here" (wire transfer) to address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" as USDC on Ethereum network
```

### Create crypto-to-crypto transfer
```
Transfer $50 worth of SBC from Base network address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" to USDC on Ethereum address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Create transfer to bank account
```
Create a transfer for account "2xLccOeZcUEpSmBIhvwIMeHtes4" of $200 USD from USDC on Ethereum address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q" to financial institution "bank_id_here" via ACH transfer
```

### Create multi-step transfer workflow
```
For account "2xLccOeZcUEpSmBIhvwIMeHtes4", create a transfer of $1000 USD:
- Source: Financial institution via wire transfer
- Destination: Convert to SBC tokens on Base network
- Target address: 2xLcccQBNlB2o3HzIoIQzn1Fy1Q
```

## Address and Balance Management

### View account addresses
```
Show me all addresses for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Create external address (wallet)
```
Create an external address for account "2xLccOeZcUEpSmBIhvwIMeHtes4" named "MetaMask Wallet" supporting Ethereum, Polygon, and Base networks at address "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
```

### Create multi-chain external address
```
Link my hardware wallet to account "2xLccOeZcUEpSmBIhvwIMeHtes4":
- Name: "Ledger Hardware Wallet"
- Address: 0x1234567890123456789012345678901234567890
- Supported networks: Ethereum, Polygon, Base, Arbitrum, Optimism
```

### Create Solana external address
```
Create an external Solana address for account "2xLccOeZcUEpSmBIhvwIMeHtes4" named "Phantom Wallet" at address "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK" supporting Solana network
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

### Create external financial institution (bank account)
```
Create an external financial institution for account "2xLccOeZcUEpSmBIhvwIMeHtes4" named "Business Checking Account" with ACH and wire support for Chase Bank account 123456789, routing number 021000021, owned by "TechCorp LLC" at 123 Main St, New York, NY 10001, USA, account type checking
```

### Create financial institution with detailed bank info
```
Link a bank account to account "2xLccOeZcUEpSmBIhvwIMeHtes4":
- Name: "Primary Business Account"
- Transfer types: ACH and wire
- Bank: Wells Fargo
- Owner: John Doe
- Account number: 987654321
- Routing number: 121000248
- Account type: checking
- Bank address: 420 Montgomery St, San Francisco, CA 94104, USA
```

## Automation Management

### View all automations
```
Show me all automations for account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Get specific automation details
```
Get details for automation "automation_id_here" in account "2xLccOeZcUEpSmBIhvwIMeHtes4"
```

### Create automation for customer onramp
```
Create an automation for account "2xLccOeZcUEpSmBIhvwIMeHtes4" named "Customer Onramp" that automatically converts incoming deposits to SBC tokens on Base network using address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q"
```

### Create automation for USDC conversion
```
Set up an automation for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
- Name: "USDC Auto-Converter"
- Destination: Convert to USDC on Ethereum network
- Target address: 2xLcccQBNlB2o3HzIoIQzn1Fy1Q
```

### Create automation for multi-chain distribution
```
Create an automation for account "2xLccOeZcUEpSmBIhvwIMeHtes4" named "Multi-Chain Distributor" that automatically distributes incoming funds to SBC on Base network using address "2xLcccQBNlB2o3HzIoIQzn1Fy1Q"
```

## Complex Workflows

### Complete onboarding workflow
```
Help me set up a complete Brale integration for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Link my Chase business checking account (account: 123456789, routing: 021000021)
2. Add my MetaMask wallet (0x742d35Cc6634C0532925a3b8D4C9db96590c6C87) for Ethereum and Base
3. Create an automation to convert incoming bank deposits to SBC on Base
4. Show me the current portfolio status
```

### Multi-chain portfolio setup
```
Set up a multi-chain stablecoin portfolio for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Link external wallets for Ethereum, Polygon, and Base networks
2. Check current balances across all chains
3. Create automations for automatic USDC distribution
4. Set up ACH transfers from my bank account
```

### Treasury management workflow
```
Help me manage my company treasury with account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Link our primary business bank account for ACH transfers
2. Add our hardware wallet for secure crypto storage
3. Set up automated conversions from USD to SBC tokens
4. Create monthly transfer automation from bank to crypto
5. Show me a complete portfolio analysis
```

### Cross-chain arbitrage setup
```
Set up cross-chain arbitrage infrastructure for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Add external addresses on Ethereum, Polygon, Base, and Arbitrum
2. Check USDC balances across all networks
3. Create automations for optimal token distribution
4. Set up bank account for fiat on/off ramps
```

### Customer onramp solution
```
Build a customer onramp solution for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Create automation for incoming customer deposits
2. Set up automatic conversion to SBC tokens on Base
3. Configure distribution to customer wallet addresses
4. Link bank account for settlement
5. Test the complete flow with a small transfer
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

### Test API connectivity
```
Configure the Brale API and test connectivity by retrieving all accounts
```

### Connection test
```
Test my Brale API connection and show account status
```

### Validate account setup
```
For account "2xLccOeZcUEpSmBIhvwIMeHtes4", show me:
1. Account details and KYB status
2. All linked addresses and their balances
3. Connected financial institutions
4. Active automations
5. Recent transfer history
```

### Test balance checking across chains
```
Check balances for account "2xLccOeZcUEpSmBIhvwIMeHtes4" across all networks:
- USDC on Ethereum, Polygon, and Base
- SBC on Base network
- Any other available tokens
```

### Balance discrepancy investigation
```
Investigate balance discrepancies for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Check all address balances
2. Review recent transfers
3. Identify any pending or failed transactions
4. Provide reconciliation report
```

### Troubleshoot transfer issues
```
Help me troubleshoot transfer problems for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Check if financial institutions are properly linked
2. Verify external addresses are configured
3. Test a small transfer between endpoints
4. Review recent transfer history for errors
```

### Validate automation setup
```
Test automation configuration for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. List all active automations
2. Verify destination addresses are valid
3. Check automation rules and triggers
4. Test with a small deposit
```

### Network status check
```
Check the status of all blockchain networks for account "2xLccOeZcUEpSmBIhvwIMeHtes4" and report any issues with balances or connectivity
```

## Advanced Use Cases

### DeFi integration workflow
```
Set up DeFi integration for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Link multiple DeFi protocol addresses
2. Set up automated yield farming with SBC tokens
3. Create rebalancing automations
4. Monitor cross-chain opportunities
```

### Payment processor setup
```
Configure payment processing infrastructure for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Create customer deposit automations
2. Set up instant settlement to bank accounts
3. Configure multi-currency support
4. Implement fraud detection workflows
```

### Institutional treasury management
```
Build institutional treasury solution for account "2xLccOeZcUEpSmBIhvwIMeHtes4":
1. Link multiple bank accounts for different currencies
2. Set up automated compliance reporting
3. Create risk management automations
4. Implement multi-signature wallet integration
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