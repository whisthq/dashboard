import { Formik, Form, Field } from 'formik'
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, Fragment, useState } from 'react'

import { Policy } from '../lib/types'
import { globalPolicy } from '../constants/policy'

export default function PolicyForm({
  policy,
  isUpdate,
  onPolicyUpdate,
  showFormOnSuccess,
}: {
  policy: Policy,
  isUpdate: boolean,
  onPolicyUpdate: Dispatch<boolean>,
  showFormOnSuccess: Dispatch<boolean>,
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Policies successfuly set
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Policies have been set and will be applied to all members
                      in the organization.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsOpen(false)
                        showFormOnSuccess(false)
                      }}
                    >
                      Accept
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Formik
        initialValues={isUpdate ? policy : {}}
        onSubmit={async (attributes, { setSubmitting }) => {
          const data = {
            type: 'policy',
            attributes,
          }
          console.log(data)
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

          if (response.status == 200 || response.status == 201) {
            setIsOpen(true)
            onPolicyUpdate(data.attributes)
          }
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
