import { Fragment } from 'react'
import { Formik, Form, Field } from 'formik'
import { globalPolicy } from '../constants/policy'

export default function PolicyForm({
  orgId,
  policyId,
  policy,
  token,
  isUpdate,
}) {
  return (
    <>
      <Formik
        initialValues={globalPolicy}
        validate={(values) => console.log(values)}
        onSubmit={async (values, { setSubmitting }) => {
          const data = {
            // Add the organization id before sending to API
            org_id: orgId,
            policy: values,
          }

          const endpoint = '/api/policies'

          let options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }

          if (isUpdate) {
            options = {
              endpoint: endpoint + `/${policyId}`,
              method: 'PUT',
              ...options,
            }
          } else {
            options = {
              endpoint: endpoint,
              method: 'POST',
              ...options,
            }
          }

          setSubmitting(true)
          const response = await fetch(endpoint, options)
          const result = await response.json()
          setSubmitting(false)
          console.log(result)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {Object.entries(policy).map(([k, v]) => {
              return typeof v == 'boolean' ? (
                <div
                  key={k}
                  className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                >
                  <div className="text-sm font-medium text-gray-900">{k}</div>
                  <div>
                    <Field type="checkbox" id={k} name={k}></Field>
                  </div>
                </div>
              ) : Array.isArray(v) ? (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-900">{k}</div>
                  <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 rounded-md border border-gray-200"
                    >
                      {v.map((elem, i) => (
                        <Field
                          name={`${k}.${i}`}
                          key={i}
                          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        ></Field>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-900">{k}</div>
                  <Field
                    id={k}
                    name={k}
                    className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"
                  />
                </div>
              )
            })}

            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}
