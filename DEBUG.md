# Debugging Guide for Brale API MCP Server

This guide covers the three debugging approaches implemented for the Brale API MCP server.

## 1. File-based Logging for Development

### Setup
The server automatically logs to `mcp-debug.log` when running in development mode.

### Environment Variables
Set these in your `.env` file:
```bash
NODE_ENV=development
MCP_DEBUG=true
```

### Available Scripts
```bash
# Development with file logging and auto-reload
npm run dev

# Development with file logging (single run)
npm run debug

# Production mode (no logging)
npm run prod

# View logs in real-time
npm run logs

# Clear log file
npm run clear-logs
```

### Log Levels
- **INFO**: Server startup, configuration, token acquisition
- **DEBUG**: Detailed request tracing, token status, API calls
- **WARN**: Warnings and fallbacks
- **ERROR**: Actual errors and failures

### Example Log Output
```
2025-05-28T01:26:03.702Z [INFO] Brale API MCP server started on stdio
2025-05-28T01:26:10.123Z [DEBUG] Received tool request {"tool":"brale_get_address_balances","args":{...}}
2025-05-28T01:26:10.125Z [DEBUG] Checking token status {"hasToken":true,"timeUntilExpiry":3275831}
2025-05-28T01:26:10.126Z [DEBUG] Using existing valid token
2025-05-28T01:26:10.127Z [DEBUG] Making balance request {"url":"/accounts/.../balance?transfer_type=base&value_type=SBC"}
2025-05-28T01:26:10.234Z [DEBUG] Balance request successful {"status":200,"data":{...}}
```

## 2. MCP Inspector for Interactive Debugging

### Usage
```bash
# Start the inspector
npm run inspector
```

This will:
1. Start the MCP server with debug logging enabled
2. Open a web interface (usually at http://localhost:5173)
3. Allow you to interactively test tools and see detailed logs

### Features
- Interactive tool testing
- Real-time request/response viewing
- Schema validation
- Error debugging

### Accessing the Inspector
1. Run `npm run inspector`
2. Open your browser to the URL shown in the terminal
3. Test tools directly in the web interface

## 3. Production Mode

### Clean Production Builds
```bash
# Run without any logging
npm run prod

# Or use the standard start command
npm start
```

### Production Characteristics
- No file logging
- No console output (MCP protocol compliance)
- Minimal overhead
- Clean JSON-only communication

## Debugging Workflow

### For Development
1. **Start with file logging**: `npm run dev`
2. **Make API calls** through Cursor or other MCP clients
3. **Monitor logs**: `npm run logs` (in another terminal)
4. **Check specific issues** in `mcp-debug.log`

### For Interactive Testing
1. **Use MCP Inspector**: `npm run inspector`
2. **Test tools directly** in the web interface
3. **Debug schema issues** and parameter validation
4. **Verify responses** before deploying

### For Production
1. **Test with production mode**: `npm run prod`
2. **Verify no console output** interferes with MCP protocol
3. **Deploy with confidence**

## Common Issues

### No Logs Generated
- Check that `NODE_ENV=development` and `MCP_DEBUG=true` are set
- Verify the server is running with `npm run dev` or `npm run debug`
- Check file permissions in the project directory

### MCP Protocol Errors
- Ensure no console.log/console.error in production
- Use file logging instead of console output
- Verify JSON-only communication on stdio

### Token Issues
- Check debug logs for token status and refresh attempts
- Verify environment variables are loaded correctly
- Look for OAuth2 error details in logs

## Log File Management

### Viewing Logs
```bash
# View entire log file
cat mcp-debug.log

# Follow logs in real-time
tail -f mcp-debug.log

# Search for specific entries
grep "ERROR" mcp-debug.log
grep "balance request" mcp-debug.log
```

### Cleaning Up
```bash
# Clear logs
npm run clear-logs

# Or manually
rm mcp-debug.log
```

## Environment Configuration

### Development (.env)
```bash
NODE_ENV=development
MCP_DEBUG=true
BRALE_CLIENT_ID="your_client_id"
BRALE_CLIENT_SECRET="your_client_secret"
```

### Production
```bash
NODE_ENV=production
# MCP_DEBUG not set or false
BRALE_CLIENT_ID="your_client_id"
BRALE_CLIENT_SECRET="your_client_secret"
```

## Best Practices

1. **Always use file logging** for development debugging
2. **Never use console output** in MCP servers on stdio
3. **Test with MCP Inspector** before deploying
4. **Use production mode** for final testing
5. **Monitor logs** during development
6. **Clean up logs** regularly to avoid large files 