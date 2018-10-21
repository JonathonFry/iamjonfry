import React from "react";

import profilePic from "../assets/profile.jpg";
import twitter from "../assets/twitter.svg";
import github from "../assets/github.svg";
import { rhythm } from "../utils/typography";

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
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
            alignItems: "center",
            marginBottom: 0
          }}
        >
          Written by&nbsp;
          <span
            style={{
              fontWeight: "bold"
            }}
          >
            Jonathon Fry
          </span>
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 0
          }}
        >
          <a href="https://twitter.com/jonfry22">
            <img
              src={twitter}
              alt={`Twitter`}
              style={{
                width: rhythm(3 / 4),
                height: rhythm(3 / 4),
                display: "flex",
                alignItems: "center",
                marginBottom: 0,
                marginLeft: rhythm(1 / 2)
              }}
            />
          </a>

          <a href="https://github.com/JonathonFry">
            <img
              src={github}
              alt={`Github`}
              style={{
                width: rhythm(3 / 4),
                height: rhythm(3 / 4),
                display: "flex",
                alignItems: "center",
                marginBottom: 0,
                marginLeft: rhythm(1 / 2)
              }}
            />
          </a>
        </div>
      </div>
    );
  }
}

export default Bio;
