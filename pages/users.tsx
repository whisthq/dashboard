{/* <div>
{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
<a href="/api/auth/logout">Log out</a>
<br />
<br />
<p>Policy</p>
<textarea readOnly value={JSON.stringify(policy)} />
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
</div> */}