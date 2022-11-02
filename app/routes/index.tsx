import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1>Welcome to Remix Forms Playground 👋</h1>
      <ul>
        <li>
          <Link to="/conform">Conform</Link>
        </li>
        <li>
          <Link to="/conform-domain-functions">Conform Domain Functions</Link>
        </li>
      </ul>
    </div>
  );
}
