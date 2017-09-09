/**
 * The user auth data, this allows use to only authenticate the user
 * one time and then reuse it for future calls
 * @type {Object}
 */
let auth;

/**
 * Get the user auth using his credentials
 * @param  {Object}  credentials The user credentials
 * @return {Promise}             The auth data or undefined
 */
const getAuth = async ({ credentials, cookies, isServer }) => {
  // if the user is already authenticated
  if (auth) return auth;
  // if we already saved the authentication token in cookies return it
  if (cookies.get('auth')) return cookies.get('auth');
  // if we don't have credentials throw an error
  if (!credentials || credentials === undefined) {
    throw new Error('Invalid credentials.');
  }
  // check the credentials type
  switch (credentials.type) {
    // if the type is password authenticate the user with it
    case 'password': {
      // create new FormData and set credentials id and password there
      const formData = new FormData();
      formData.set('id', credentials.id);
      formData.set('password', credentials.password);
      // use credentials to authenticate the user
      const response = await fetch('/api/auth', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Ajax': true
        }
      });
      // get the response as JSON (probably the user profile or a token)
      auth = await response.text();
      // save auth data to cookies
      cookies.set('auth', auth, { secure: false });
      // return the auth data
      return auth;
    }
    // if it's not a handled type throw an error
    default: {
      throw new Error('Invalid credentials.');
    }
  }
};

export default getAuth;
