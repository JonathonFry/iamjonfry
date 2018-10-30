import React from "react";
import { Link } from "gatsby";

import { rhythm } from "../utils/typography";

class Template extends React.Component {
  render() {
    const { children } = this.props;
    let header = (
      <h4
        style={{
          marginTop: 0
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit"
          }}
          to={"/"}
        >
          iamjonfry.com
        </Link>
      </h4>
    );

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: rhythm(24),
          padding: `${rhythm(3 /4)} ${rhythm(3 / 4)}`
        }}
      >
        {header}
        {children}
      </div>
    );
  }
}

export default Template;
