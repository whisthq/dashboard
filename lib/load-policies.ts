// lib/load-policies.ts
import { mongo } from '../lib/util'

export type Policy = {
  [key: string]: string | boolean | number | bigint | object
}

// loadPolicy returns the first policy of a given organization.
// TODO: right now, only global policies are supported. Later on each
// policy will be defined per user so the queries should be more granular.
export async function loadPolicy(orgId: string): Promise<Policy | null> {
  try {
    const db = await mongo()
    const policies = db.db('policies').collection('org_policies')
    const policy = await policies.findOne<Policy>({ org_id: orgId })
    return policy
  } catch (err) {
    console.error(err)
    // handle error
    return null
  }
}
