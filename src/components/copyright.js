import React from "react";

import { rhythm } from "../utils/typography";

class CopyrightTemplate extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          marginRight: "auto",
          marginLeft: "auto"
        }}
      >
        <p
          style={{
            color: "#757575",
            fontSize: rhythm(0.6)
          }}
        >
          iamjonfry.com © 2018
        </p>
      </div>
    );
  }
}

export default CopyrightTemplate;
