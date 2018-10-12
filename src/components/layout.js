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
    let about = (
      <h4
        style={{
          marginTop: 0,
          flexWrap: "wrap"
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit"
          }}
          to={"/about"}
        >
          about
        </Link>
      </h4>
    );

    let portfolio = (
      <h4
        style={{
          marginTop: 0,
          flexWrap: "wrap",
          marginLeft: "10px"
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit"
          }}
          to={"/portfolio"}
        >
          portfolio
        </Link>
      </h4>
    );

    let pages = (
      <div
        style={{
          display: "flex",
          marginLeft: "auto",
          justifyContent: "spaceBetween"
        }}
      >
        {about}
        {portfolio}
      </div>
    )

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
        }}
      >
        {header}
        {pages}
        {children}
      </div>
    );
  }
}

export default Template;
