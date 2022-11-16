// util.ts

/**
 * Helpful utilities.
 */

import { ManagementClient } from 'auth0'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URL as string)

export const auth0 = new ManagementClient({
  domain: process.env.AUTH0_MACHINE_DOMAIN as string,
  clientId: process.env.AUTH0_MACHINE_CLIENT_ID as string,
  clientSecret: process.env.AUTH0_MACHINE_CLIENT_SECRET as string,
  scope: 'read:organization_members'
})

export const mongo = client.connect()
