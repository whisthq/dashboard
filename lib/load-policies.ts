// lib/load-policies.ts
import { Policy } from '../lib/types'
import { mongo } from '../lib/util'

// loadPolicy returns the first policy of a given organization.
// TODO: right now, only global policies are supported. Later on each
// policy will be defined per user so the queries should be more granular.
export async function loadPolicy(orgId: string): Promise<Policy | null> {
  try {
    const db = await mongo()
    const policies = db.db('policies').collection('org_policies')
    const policy = await policies.findOne({ _id: orgId })
    return policy as Policy
  } catch (err) {
    // handle error
    return null
  }
}
