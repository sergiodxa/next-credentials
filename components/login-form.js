export default ({ onSubmit }) => (
  <form id="form" method="POST" action="/api/auth" onSubmit={onSubmit}>
    <div>
      <label htmlFor="id">Username</label>
      <input type="email" id="id" name="id" autoComplete="username" autoFocus />
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        autoComplete="current-password"
      />
    </div>
    <button>Login</button>
  </form>
);
