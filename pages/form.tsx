// index.ts

/**
 *
 */

import type { InferGetServerSidePropsType } from 'next'
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorComponent from 'next/error'

import { isAdministrator } from '../lib/auth'
import { loadPolicy } from '../lib/load-policies'

export default function Form({
  authorized,
  orgId,
  policy,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    const formData = {}

    // Add the org id extracted from the session
    formData['org_id'] = orgId

    Object.keys(policy).forEach((key) => {
      const current = event.target[key]

      // If event comes from a checkbox, use the checked
      // property instead of value
      if (current.type == 'checkbox') {
        formData[key] = current.checked
        return
      }

      // Try to parse the string as an number.
      if (current.type == 'number') {
        formData[key] = parseInt(current.value)
        return
      }

      // If the string is comma-separated, parse to an array.
      const commaSeparated = current.value.split(',')
      if (commaSeparated.length > 1) {
        formData[key] = commaSeparated
        return
      }

      formData[key] = current.value
    })
    console.log(formData)

    // Get data from the form.
    const data = {
      policy: formData,
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/policies'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    console.log(result)
  }
  if (authorized) {
    return (
      <div>
        <p>Policy</p>

        <div style={{ padding: '2em' }}>
          <form onSubmit={handleSubmit}>
            {Object.entries(policy).map(([k, v]) => {
              return typeof v == 'boolean' ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '1rem',
                  }}
                  key={k}
                >
                  <p>{k}</p>
                  <input id={k} name={k} type="checkbox" />
                </div>
              ) : typeof v == 'number' ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '1rem',
                  }}
                  key={k}
                >
                  <p>{k}</p>
                  <input id={k} name={k} type="number" />
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '1rem',
                  }}
                  key={k}
                >
                  <label>{k}</label>
                  <input id={k} name={k} defaultValue={v} />
                </div>
              )
            })}
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    )
  } else {
    return (
      <ErrorComponent
        statusCode={403}
        title="You are not authorized to view this page"
      />
    )
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    if (!(await isAdministrator(ctx.req, ctx.res))) {
      ctx.res.statusCode = 403
      return { props: { authorized: false, policy: {} } }
    }
    const policy = await loadPolicy('form_data')
    const session = getSession(ctx.req, ctx.res)
    const orgId = session?.user.org_id

    return {
      props: {
        authorized: true,
        orgId: orgId,
        token: session?.accessToken,
        policy: JSON.parse(JSON.stringify(policy?.policy)),
      },
    }
  },
})
