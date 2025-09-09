"use node"

import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Configuration, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  });

const client = new PlaidApi(configuration)

export const testPlaidConnection = action({
    args: {},
    returns: v.object({
      success: v.boolean(),
      message: v.string(),
      environment: v.string(),
    }),
    handler: async (ctx) => {
      try {
        // This is a simple API call that doesn't require user auth
        // It just tests if our credentials are valid
        const request = {
          user: {
            client_user_id: 'test_user_' + Date.now(),
          },
          client_name: "Prosper App",
          products: ['transactions'],
          country_codes: ['US'],
          language: 'en',
        } as LinkTokenCreateRequest;
  
        const response = await client.linkTokenCreate(request);
        
        return {
          success: true,
          message: "Plaid connection successful! Link token created.",
          environment: process.env.PLAID_ENV || 'sandbox',
        };
      } catch (error) {
        console.error('Plaid connection error:', error);
        return {
          success: false,
          message: `Plaid connection failed: ${error}`,
          environment: process.env.PLAID_ENV || 'sandbox',
        };
      }
    },
  });
  