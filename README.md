# Whist Enterprise Dashboard

The Whist Enterprise Dashboard allows customer account administrators to manage their accounts.

### Development

To start working on the Enterprise Dashboard locally, start by creating a file called `.env.local` at the top level of the repository with the following contents:

```
# .env.local

# The name, as it were, for the collection of logical endpoints that together
# constitute the Whist API. Set in the Auth0 dashboard under Applications >
# APIs > Whist API > Settings. In order for an access token to be valid, its
# aud claim must match this value.
AUTH0_AUDIENCE=https://api.fractal.co

# This is where the Docker Compose stack will serve the application by default.
# NOTE: Docker Compose will not read this value; it must be set so the
# Dashboard's code knows where it can be reached.
AUTH0_BASE_URL=http://localhost:3000

# The URL of an Auth0 tenant (e.g. Whist's development tenant).
AUTH0_ISSUER_BASE_URL=http://fractal-dev.us.auth0.com

# The client ID of the Enterprise Dashboard client registered with the Auth0
# tenant whose URL is AUTH0_ISSUER_BASE_URL. This value and AUTH0_CLIENT_SECRET
# are the credentials that allow the Dashboard backend to authenticate itself
# to the authorization server (our Auth0 tenant). It should remain pretty
# static, especially in production, but since each OAuth client's client ID is
# unique, it does vary from tenant to tenant. In case the sample value is
# incorrect, you can find the correct one on the Auth0 dashboard under
# Applications > Enterprise Dashboard.
AUTH0_CLIENT_ID=MSsG2owEQoXYmTG7wOGQyH4PeMJonBKM

# The client secret of the OAuth client whose client ID is AUTH0_CLIENT_ID.
# You'll need to visit the Auth0 dashboard to find this value. Look under
# Applications > Enterprise Dashboard.
AUTH0_CLIENT_SECRET=***

# Yes, I know this value is redundant (it's a substring of
# AUTH0_ISSUER_BASE_URL), but development environment configuration wasn't
# really a priority when I was setting this up. Make sure that this value is
# just a hostname (no protocol). Otherwise, it should match
# AUTH0_ISSUER_BASE_URL.
AUTH0_MACHINE_DOMAIN=fractal-dev.us.auth0.com

# In addition to allowing account administrators to manage browser policies,
# the enterprise dashboard also acts as a wrapper around the Auth0 management
# API (the API that I can use to view modify settings on the Auth0 dashboard
# programmatically); at a bare minimum, we want administrators to be able to
# view and edit the members of their organization. Think of it like this: Auth0
# is our user database and this and AUTH0_MACHINE_CLIENT_SECRET are the
# credentials the Dashboard uses to authenticate with that Database. Due to
# limitations imposed on us by the OAuth specification, we are not allowed to
# use the web application's credentials (AUTH0_CLIENT_ID and
# AUTH0_CLIENT_SECRET above) for this purpose. In case this value changes
# (rare) or is incorrect, you can find the correct one on the Auth0 dashboard
# under Applications > Dashboard Service > Settings.
AUTH0_MACHINE_CLIENT_ID=INMZ1s37upQ5hXle1Ap9j5lAY9bAa5xJ

# The client secret of the application whose client ID is
# AUTH0_MACHINE_CLIENT_ID. Find the correct value on the Auth0 dashboard under
# Applications > Dashboard Service > Settings.
AUTH0_MACHINE_CLIENT_SECRET=***

# openid, profile, and email are standard OpenID scopes that we probably don't
# even need, honestly. Users must also have administrator privileges in order
# to access the Dashboard.
AUTH0_SCOPE="openid profile email admin"

# A secret that the Dashboard uses to encrypt session cookies. You can choose
# any value you'd like here. Generate a secure secret with:
#
#   openssl rand -hex 32
AUTH0_SECRET=***
```

Once you've populated `.env.local`, run `docker compose run deps` to install Nodejs dependencies into a Docker volume that will be used by the application running in the Docker Compose stack.
If you want to run linters and formatters locally, you'll also have to install these same dependencies with `npm install`.
The reason why we have to install dependencies twice is that macOS Docker actually runs containers inside a Linux virtual machine.
macOS users may encounter errors if they try to mount their macOS Nodejs dependencies to the container running the development application.

After running `docker compose run deps` you're good to go!
Bring up the development application with `docker compose up [-d]`.
You can use it by visiting `http://localhost:3000` in your web browser.
If it's working properly, you won't be able to log in to the development Enterprise Dashboard unless you are an administrator of an organization on our Auth0 tenant.
Visit the Auth0 dashboard to add yourself or ask someone to do it for you.

Before submitting any changes you make, ensure your code is properly formatted and devoid of lint by running `npm run lint [-- [--help]]` and `npm run format [-- [--help]]`.
