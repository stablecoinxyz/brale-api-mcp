import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Account, 
  AccountCreateRequest, 
  Transfer, 
  TransferCreateRequest,
  Address,
  AddressCreateRequest,
  FinancialInstitution,
  FinancialInstitutionCreateRequest,
  Automation,
  AutomationCreateRequest,
  BraleAPIConfig,
  OAuth2TokenResponse
} from './types.js';
import { logger } from './logger.js';

export class BraleAPIClient {
  private client: AxiosInstance;
  private authClient: AxiosInstance;
  private config: BraleAPIConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: BraleAPIConfig) {
    this.config = {
      authURL: 'https://auth.brale.xyz',
      ...config
    };
    
    // Client for auth requests
    this.authClient = axios.create({
      baseURL: this.config.authURL,
    });
    
    // Client for API requests
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to handle authentication
    this.client.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      if (this.accessToken) {
        config.headers['Authorization'] = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  private async ensureValidToken(): Promise<void> {
    const now = Date.now();
    
    logger.debug('Checking token status', {
      hasToken: !!this.accessToken,
      tokenExpiresAt: this.tokenExpiresAt,
      timeUntilExpiry: this.tokenExpiresAt - now
    });
    
    // If we have a valid token that hasn't expired, use it
    if (this.accessToken && now < this.tokenExpiresAt) {
      logger.debug('Using existing valid token');
      return;
    }

    // If we have a bearer token in config, use it directly
    if (this.config.bearerToken) {
      logger.info('Using bearer token from config');
      this.accessToken = this.config.bearerToken;
      this.tokenExpiresAt = now + (24 * 60 * 60 * 1000); // Assume 24 hour expiry
      return;
    }

    // Otherwise, get a new token using client credentials
    if (this.config.clientId && this.config.clientSecret) {
      logger.info('Getting new token with client credentials');
      await this.getAccessToken();
      return;
    }

    throw new Error('No authentication method available. Provide either bearerToken or clientId/clientSecret');
  }

  private async getAccessToken(): Promise<void> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('Client ID and Client Secret are required for OAuth2 authentication');
    }

    // Create base64 encoded credentials
    const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    logger.debug('Requesting new access token');

    try {
      const response: AxiosResponse<OAuth2TokenResponse> = await this.authClient.post(
        '/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry time with 5 minute buffer
      this.tokenExpiresAt = Date.now() + ((response.data.expires_in - 300) * 1000);
      logger.info('New token obtained', { expiresIn: response.data.expires_in });
    } catch (error) {
      logger.error('Failed to get access token', error);
      if (error instanceof Error) {
        throw new Error(`Failed to get access token: ${error.message}`);
      } else {
        throw new Error(`Failed to get access token: ${String(error)}`);
      }
    }
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    const response: AxiosResponse<Account[]> = await this.client.get('/accounts');
    return response.data;
  }

  async getAccount(accountId: string): Promise<Account> {
    const response: AxiosResponse<Account> = await this.client.get(`/accounts/${accountId}`);
    return response.data;
  }

  async createAccount(accountData: AccountCreateRequest, idempotencyKey: string): Promise<{ id: string }> {
    const response: AxiosResponse<{ id: string }> = await this.client.post('/accounts', accountData, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  }

  // Transfer endpoints
  async getTransfers(accountId: string): Promise<Transfer[]> {
    const response: AxiosResponse<Transfer[]> = await this.client.get(`/accounts/${accountId}/transfers`);
    return response.data;
  }

  async getTransfer(accountId: string, transferId: string): Promise<Transfer> {
    const response: AxiosResponse<Transfer> = await this.client.get(`/accounts/${accountId}/transfers/${transferId}`);
    return response.data;
  }

  async createTransfer(accountId: string, transferData: TransferCreateRequest, idempotencyKey: string): Promise<{ id: string }> {
    const response: AxiosResponse<{ id: string }> = await this.client.post(`/accounts/${accountId}/transfers`, transferData, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  }

  // Address endpoints
  async getAddresses(accountId: string): Promise<{ addresses: Address[] }> {
    const response: AxiosResponse<{ addresses: Address[] }> = await this.client.get(`/accounts/${accountId}/addresses`);
    return response.data;
  }

  async createExternalAddress(accountId: string, addressData: AddressCreateRequest, idempotencyKey: string): Promise<{ id: string }> {
    const response: AxiosResponse<{ id: string }> = await this.client.post(`/accounts/${accountId}/addresses/external`, addressData, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  }

  async getAddressBalances(accountId: string, addressId: string, transferType: string, valueType: string): Promise<any> {
    const params = new URLSearchParams();
    params.append('transfer_type', transferType);
    params.append('value_type', valueType);
    
    const url = `/accounts/${accountId}/addresses/${addressId}/balance?${params.toString()}`;
    logger.debug('Making balance request', { url, accountId, addressId, transferType, valueType });
    
    try {
      const response = await this.client.get(url);
      logger.debug('Balance request successful', { status: response.status, data: response.data });
      return response.data;
    } catch (error: any) {
      logger.error('Balance request failed', {
        url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  // Financial Institution endpoints
  async getFinancialInstitutions(accountId: string): Promise<{ financial_institutions: FinancialInstitution[] }> {
    const response: AxiosResponse<{ financial_institutions: FinancialInstitution[] }> = await this.client.get(`/accounts/${accountId}/financial-institutions`);
    return response.data;
  }

  async getFinancialInstitution(accountId: string, institutionId: string): Promise<FinancialInstitution> {
    const response: AxiosResponse<FinancialInstitution> = await this.client.get(`/accounts/${accountId}/financial-institutions/${institutionId}`);
    return response.data;
  }

  async createExternalFinancialInstitution(accountId: string, institutionData: FinancialInstitutionCreateRequest, idempotencyKey: string): Promise<{ id: string }> {
    const response: AxiosResponse<{ id: string }> = await this.client.post(`/accounts/${accountId}/financial-institutions/external`, institutionData, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  }

  // Automation endpoints
  async getAutomations(accountId: string): Promise<{ automations: Automation[] }> {
    const response: AxiosResponse<{ automations: Automation[] }> = await this.client.get(`/accounts/${accountId}/automations`);
    return response.data;
  }

  async getAutomation(accountId: string, automationId: string): Promise<Automation> {
    const response: AxiosResponse<Automation> = await this.client.get(`/accounts/${accountId}/automations/${automationId}`);
    return response.data;
  }

  async createAutomation(accountId: string, automationData: AutomationCreateRequest, idempotencyKey: string): Promise<{ id: string }> {
    const response: AxiosResponse<{ id: string }> = await this.client.post(`/accounts/${accountId}/automations`, automationData, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return response.data;
  }
} 