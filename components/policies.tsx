// index.ts

/**
 *
 */

import type { InferGetServerSidePropsType } from 'next'
import ErrorComponent from 'next/error'
import Image from 'next/image'

export default function Dashboard({
  authorized,
  policy,
  members,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (authorized) {
    return (
      <div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">Log out</a>
        <br />
        <br />
        <p>Policy</p>

        <div style={{ padding: '2em' }}>
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
                <input type="checkbox" checked={v} disabled />
              </div>
            ) : Array.isArray(v) ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '1rem',
                }}
                key={k}
              >
                <p>{k}</p>
                <ul>
                  {v.map((elem, i) => (
                    <li key={i}>{elem}</li>
                  ))}
                </ul>
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
                <p>{k}</p>
                <p>{v}</p>
              </div>
            )
          })}
        </div>

        <br />
        <br />
        <p>Users</p>
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {members.map(({ email, name, picture, roles, user_id: userId }) => (
              <tr key={userId}>
                <td>
                  <Image
                    src={picture ?? ''}
                    alt={name ?? ''}
                    width={48}
                    height={48}
                  />
                </td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{roles.map((role) => role.name).join(', ') || 'Member'}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
