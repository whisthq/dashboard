import {  Switch } from '@headlessui/react'
import { useState } from 'react'
import classNames from 'classnames'

const people = [
    { id: 1, name: 'High-Risk' },
    { id: 2, name: 'Social Media' },
    { id: 3, name: 'News' },
    { id: 4, name: 'Non-Categorized' },
    { id: 5, name: 'All Links' },
  ]

export default function Protection() {
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            Policies to protect against malware and zero-day threats.
          </p>
        </div>
      </div>
      {/* Description list with inline editing */}
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Malware Protection
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            Protects against malicious downloads
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 pt-2">Download Location</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow"></span>
                <span className="ml-4 flex-shrink-0">
                    <select
                        id="location"
                        name="location"
                        className="bg-gray-100 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Canada"
                    >
                        <option>Allow</option>
                        <option>Redirect to Google Drive</option>
                        <option>Block All</option>
                    </select>
                </span>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 pt-2">Drive-by Downloads</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow"></span>
                <span className="ml-4 flex-shrink-0">
                    <select
                        id="location"
                        name="location"
                        className="bg-gray-100 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Canada"
                    >
                        <option>Block</option>
                        <option>Warn</option>
                    </select>
                </span>
              </dd>
            </div>
            <Switch.Group
              as="div"
              className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5"
            >
              <Switch.Label
                as="dt"
                className="text-sm font-medium text-gray-500"
                passive
              >
                Encrypt Downloads
              </Switch.Label>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <Switch
                  checked={automaticTimezoneEnabled}
                  onChange={setAutomaticTimezoneEnabled}
                  className={classNames(
                    automaticTimezoneEnabled ? 'bg-purple-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      automaticTimezoneEnabled
                        ? 'translate-x-5'
                        : 'translate-x-0',
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </dd>
            </Switch.Group>
          </dl>
        </div>
      </div>

      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Zero-Day Protection
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            Protect against zero days through remote browser isolation and patching.
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
          <Switch.Group
              as="div"
              className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5"
            >
              <Switch.Label
                as="dt"
                className="text-sm font-medium text-gray-500"
                passive
              >
                Force Update to Latest Chromium
              </Switch.Label>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <Switch
                  checked={automaticTimezoneEnabled}
                  onChange={setAutomaticTimezoneEnabled}
                  className={classNames(
                    automaticTimezoneEnabled ? 'bg-purple-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-auto'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      automaticTimezoneEnabled
                        ? 'translate-x-5'
                        : 'translate-x-0',
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </dd>
            </Switch.Group>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 pt-2">Whitelisted Sites</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow"></span>
                <span className="ml-4 flex-shrink-0">
                    <select
                        id="location"
                        name="location"
                        className="bg-gray-100 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Canada"
                    >
                        <option>Isolate</option>
                        <option>Don&rsquot Isolate</option>
                    </select>
                </span>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500 pt-2">Sites to Isolate</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow"></span>
                <span className="ml-4 flex-shrink-0">
                <div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
                        {people.map((person, personIdx) => (
                        <div key={personIdx} className="relative flex items-start py-4">
                            <div className="min-w-0 flex-1 text-sm">
                            <label htmlFor={`person-${person.id}`} className="select-none font-medium text-gray-700">
                                {person.name}
                            </label>
                            </div>
                            <div className="ml-3 flex h-5 items-center">
                            <input
                                id={`person-${person.id}`}
                                name={`person-${person.id}`}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={true}
                            />
                            </div>
                        </div>
                        ))}
                        <button
                            type="button"
                            className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add Category
                        </button>
                    </div>
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
