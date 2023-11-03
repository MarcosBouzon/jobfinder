import { NavLink } from "react-router-dom";

import classes from "./Navigation.module.css";

const Navigation = () => {
  return (
    <nav className={classes.navbar}>
      <div className={classes.title}>
        <h1>JobFinder</h1>
      </div>
      <div className={classes["navlinks-wrapper"]}>
        <ul className={classes.navlinks}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                [isActive ? `${classes.active}` : "", classes.navlink].join(" ")
              }
              end
            >
              New Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applied"
              className={({ isActive }) =>
                [isActive ? classes.active : "", classes.navlink].join(" ")
              }
              end
            >
              Applied
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                [isActive ? classes.active : "", classes.navlink].join(" ")
              }
              end
            >
              <span className="material-symbols-sharp">settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
