import React from "react";

import profilePic from "../assets/profile.jpg";
import { rhythm } from "../utils/typography";

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          marginBottom: rhythm(2.5)
        }}
      >
        <img
          src={profilePic}
          alt={`Jonathon Fry`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: 50
          }}
        />
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 0
          }}
        >
          Written by Jonathon Fry
        </p>
      </div>
    );
  }
}

export default Bio;
