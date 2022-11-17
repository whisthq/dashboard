// util.ts

/**
 * Helpful utilities.
 */

import { ManagementClient } from 'auth0'
import { MongoClient } from 'mongodb'

let _auth0
let _mongo

export function auth0() {
  if (_auth0 === undefined) {
    _auth0 = new ManagementClient({
      domain: process.env.AUTH0_MACHINE_DOMAIN as string,
      clientId: process.env.AUTH0_MACHINE_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_MACHINE_CLIENT_SECRET as string,
      scope: 'read:organization_members',
    })
  }

  return _auth0
}

export function mongo() {
  if (_mongo === undefined) {
    const client = new MongoClient(process.env.MONGODB_URL as string)
    _mongo = client.connect()
  }

  return _mongo
}
