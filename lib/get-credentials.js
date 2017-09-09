/**
 * Get the user credentials using the Credential Management API
 * @param  {Boolean}  isServer If we're running server side
 * @return {Promise}           The user credentials or undefined
 */
const getCredentials = async isServer => {
  // if we're server side return undefined (no auth)
  if (isServer) return undefined;
  // if we don't support Credential Management API return undefined (no auth)
  if (!'credentials' in navigator) return undefined;
  // get credentials
  const credentials = await navigator.credentials.get({
    password: true,
    mediation: 'silent'
  });
  // if we don't have credentials return undefined (no auth)
  if (!credentials) return undefined;
  // return the credentials
  return credentials;
}

export default getCredentials;
