import type { Policy } from '../lib/types'
import { Transition } from '@headlessui/react'
import { useState, Fragment } from 'react'
import PolicyForm from '../components/form'

import { DocumentPlusIcon, PencilIcon } from '@heroicons/react/20/solid'

export default function PolicyDisplay({ policy }: { policy: Policy }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [usePolicy, setUsePolicy] = useState(policy)

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between pb-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Organization Policy
          </h2>
        </div>

        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="hidden sm:block">
            <button
              onClick={() => {
                setShowAddForm((showAddForm) => !showAddForm)
                setShowUpdateForm(false)
              }}
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <DocumentPlusIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              Create new policy
            </button>
          </span>

          <span className="ml-3 hidden sm:block">
            <button
              onClick={() => {
                setShowAddForm(false)
                setShowUpdateForm((showUpdateForm) => !showUpdateForm)
              }}
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              Edit existing policy
            </button>
          </span>
        </div>
      </div>

      <Transition
        show={showAddForm}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <PolicyForm
          policy={usePolicy}
          isUpdate={false}
          onPolicyUpdate={setUsePolicy}
          showFormOnSuccess={setShowAddForm}
        />
      </Transition>

      <Transition
        show={showUpdateForm}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <PolicyForm
          policy={usePolicy}
          isUpdate={true}
          onPolicyUpdate={setUsePolicy}
          showFormOnSuccess={setShowUpdateForm}
        />
      </Transition>

      {!showAddForm && !showUpdateForm ? (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="border-t border-gray-200">
            <div>
              {Object.entries(usePolicy).map(([k, v]) => {
                return typeof v == 'boolean' ? (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <div className="text-sm font-medium text-gray-900">{k}</div>
                    <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {v ? 'Enabled' : 'Disabled'}
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
                          <li
                            key={i}
                            className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                          >
                            <div className="flex w-0 flex-1 items-center">
                              <span className="ml-2 w-0 flex-1 truncate">
                                {elem}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <div className="text-sm font-medium text-gray-900">{k}</div>
                    <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {v?.toString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}
