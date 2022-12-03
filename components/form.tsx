import { Formik, Form, Field } from 'formik'

import { Policy } from '../lib/types'
import { globalPolicy } from '../constants/policy'

export default function PolicyForm({
  policy,
  isUpdate,
}: {
  policy: Policy
  isUpdate: boolean
}) {
  return (
    <>
      <Formik
        initialValues={isUpdate ? policy : {}}
        onSubmit={async (attributes, { setSubmitting }) => {
          const data = {
            type: 'policy',
            attributes,
          }
          const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data }),
          }

          setSubmitting(true)
          const response = await fetch('/api/policy', options)
          const result = await response.json()
          console.log(result)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {Object.entries(globalPolicy).map(([k, v]) => {
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
                          placeholder={isUpdate ? '' : elem}
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
                    placeholder={isUpdate ? '' : globalPolicy[k]?.toString()}
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
