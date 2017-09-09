import Head from 'next/head';
import { Component } from 'react';

import LoginForm from '../components/login-form';

import withAuth from '../lib/with-auth';

const avatar =
  'https://res.cloudinary.com/zeit-inc/image/upload/front/zeit/geist.png';

export default withAuth(
  class extends Component {
    handleSubmit = event => {
      if ('credentials' in navigator) {
        event.preventDefault();
        this.login(event.target);
      }
    };

    handleClick = event => {
      // disable auto login
      if ('credentials' in navigator) {
        navigator.credentials.requireUserMediation();
      }
      // remove current auth
      this.props.removeAuth();
    };

    login = async target => {
      let credentials;
      if ('credentials' in navigator) {
        // create new credentials with fake data
        credentials = new PasswordCredential(target);
        // store the credentials
        await navigator.credentials.store(credentials);
      }
      // update the page auth data
      await this.props.updateAuth(credentials);
    };

    render() {
      return (
        <main>
          <Head>
            <title>Next.js + Credential Management API</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          {this.props.auth ? (
            <div>
              Logged with token: <br />
              <strong>{this.props.auth}</strong>
              <br />
              <button onClick={this.handleClick} type="button">
                Logout
              </button>
            </div>
          ) : (
            <LoginForm onSubmit={this.handleSubmit} />
          )}
        </main>
      );
    }
  }
);
