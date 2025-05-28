import { z } from 'zod';

// Account related schemas
export const AccountAddressSchema = z.object({
  street_line_1: z.string(),
  street_line_2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const UltimateBeneficialOwnerSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  address: AccountAddressSchema,
});

export const BusinessControllerSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  address: AccountAddressSchema,
});

export const AccountSchema = z.object({
  id: z.string(),
  status: z.string(),
  business_name: z.string(),
  ein: z.string(),
  business_type: z.string(),
  address: AccountAddressSchema,
  phone_number: z.string(),
  email: z.string().email(),
  website: z.string().optional(),
  business_controller: BusinessControllerSchema,
});

export const AccountCreateRequestSchema = z.object({
  business_name: z.string(),
  ein: z.string(),
  business_type: z.string(),
  address: AccountAddressSchema,
  phone_number: z.string(),
  email: z.string().email(),
  website: z.string().optional(),
  business_controller: BusinessControllerSchema,
});

// Transfer related schemas
export const TransferEndpointSchema = z.object({
  value_type: z.string(),
  transfer_type: z.string(),
  address_id: z.string().nullable().optional(),
  financial_institution_id: z.string().nullable().optional(),
});

export const TransferSchema = z.object({
  status: z.string(),
  amount: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  source: TransferEndpointSchema,
  destination: TransferEndpointSchema,
  gasFee: z.string().optional(),
});

export const TransferCreateRequestSchema = z.object({
  amount: z.object({
    value: z.string(),
    currency: z.string(),
  }),
  source: TransferEndpointSchema,
  destination: TransferEndpointSchema,
});

// Address related schemas
export const BalanceSchema = z.object({
  balance: z.string(),
  value_type: z.string(),
});

export const AddressSchema = z.object({
  id: z.string(),
  status: z.string(),
  name: z.string(),
  address: z.string(),
  transfer_types: z.array(z.string()),
});

export const AddressBalanceResponseSchema = z.object({
  status: z.string(),
  name: z.string(),
  address: z.string(),
  transfer_types: z.array(z.string()),
  balances: z.array(BalanceSchema),
});

export const AddressCreateRequestSchema = z.object({
  name: z.string(),
  transfer_types: z.array(z.string()),
  address: z.string(),
});

// Financial Institution related schemas
export const BankDetailsSchema = z.object({
  owner: z.string(),
  account_number: z.string(),
  routing_number: z.string(),
  name: z.string(),
  address: AccountAddressSchema,
  account_type: z.string(),
});

export const FinancialInstitutionSchema = z.object({
  name: z.string(),
  transfer_type: z.array(z.string()),
  bank_details: BankDetailsSchema,
});

export const FinancialInstitutionCreateRequestSchema = z.object({
  name: z.string(),
  transfer_type: z.array(z.string()),
  bank_details: BankDetailsSchema,
});

// Automation related schemas
export const AutomationDestinationAddressSchema = z.object({
  address_id: z.string(),
  value_type: z.string(),
  transfer_type: z.string(),
});

export const WireInstructionsSchema = z.object({
  bank_beneficiary_name: z.string(),
  bank_name: z.string(),
  bank_address: z.string(),
  bank_beneficiary: z.string(),
  bank_account_number: z.string(),
  bank_routing_number: z.string(),
});

export const AutomationSchema = z.object({
  name: z.string(),
  status: z.string(),
  wire_instructions: WireInstructionsSchema,
  destinationAddress: AutomationDestinationAddressSchema,
});

export const AutomationCreateRequestSchema = z.object({
  name: z.string(),
  destination_address: AutomationDestinationAddressSchema,
});

// Type exports
export type Account = z.infer<typeof AccountSchema>;
export type AccountCreateRequest = z.infer<typeof AccountCreateRequestSchema>;
export type Transfer = z.infer<typeof TransferSchema>;
export type TransferCreateRequest = z.infer<typeof TransferCreateRequestSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type AddressCreateRequest = z.infer<typeof AddressCreateRequestSchema>;
export type FinancialInstitution = z.infer<typeof FinancialInstitutionSchema>;
export type FinancialInstitutionCreateRequest = z.infer<typeof FinancialInstitutionCreateRequestSchema>;
export type Automation = z.infer<typeof AutomationSchema>;
export type AutomationCreateRequest = z.infer<typeof AutomationCreateRequestSchema>;

// API Configuration
export interface BraleAPIConfig {
  baseURL: string;
  bearerToken?: string;
  clientId?: string;
  clientSecret?: string;
  authURL?: string;
}

// OAuth2 Token Response
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
