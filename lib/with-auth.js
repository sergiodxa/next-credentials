import { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';

import getCredentials from './get-credentials';
import getAuth from './get-auth';

/**
 * Get credentials and auth data to the initial props
 * @param  {Component} Page The page to inject auth data
 * @return {Component}      The new page with auth data
 */
export default Page =>
  class WithAuth extends Component {
    static async getInitialProps(context) {
      // check if we're running server side
      const isServer = !!context.req;
      // get cookies instance
      const cookies = isServer
        ? new Cookies(context.req.headers.cookie)
        : new Cookies();

      // get the user credentials
      const credentials = await getCredentials(isServer);

      // get the user auth (profile or token)
      let auth;
      try {
        auth = await getAuth({ credentials, cookies, isServer });
      } catch (error) {
        auth = null;
      }

      // run the page `getInitialProps` if it exists passing the usual context
      // and the credentials and auth data to be used
      const props = Page.getInitialProps
        ? await Page.getInitialProps({ ...context, auth })
        : {};

      // return the page props with auth data
      return { auth, ...props };
    }

    // save auth to state so we can update it after the first render
    state = { auth: this.props.auth };

    // when the page is rendered client side check the authentication data
    // this allow in the first CSR to check again the authentication data
    // we only run it if Credential Management API is supported
    async componentDidMount() {
      // if the user is not logged
      if (!this.state.auth && 'credentials' in navigator) {
        // create cookies instance
        const cookies = new Cookies();
        // get credentials
        const credentials = await getCredentials(false);
        // get auth data
        let auth;
        try {
          auth = await getAuth({ credentials, cookies, isServer: false });
        } catch (error) {
          auth = null;
        }
        // update state
        this.setState({ auth });
      }
    }

    // get a new authentication token with the passed credentials
    updateAuth = async credentials => {
      // create cookies instance
      const cookies = new Cookies();
      // get auth data
      const auth = await getAuth({ credentials, cookies, isServer: false });
      // update state
      this.setState({ auth });
    };

    // remove the current authentication
    removeAuth = () => {
      // create cookies instance
      const cookies = new Cookies();
      // remove auth cookie
      cookies.remove('auth');
      // update state
      this.setState({ auth: null });
    };

    // render the wrapped page and pass the props and auth data
    render() {
      return (
        <Page
          {...this.props}
          auth={this.state.auth}
          updateAuth={this.updateAuth}
          removeAuth={this.removeAuth}
        />
      );
    }
  };
