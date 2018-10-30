import React from "react";
import Helmet from "react-helmet";
import { Link, graphql } from "gatsby";
import get from "lodash/get";
import { DiscussionEmbed } from "disqus-react";

import Bio from "../components/bio";
import Copyright from "../components/copyright";
import Layout from "../components/layout";
import { rhythm, scale } from "../utils/typography";

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteTitle = get(this.props, "data.site.siteMetadata.title");
    const siteDescription = post.excerpt;
    const { previous, next } = this.props.pageContext;
    const disqusShortname = "iamjonfry";
    const disqusConfig = {
      identifier: post.id,
      title: post.frontmatter.title
    };

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: "en" }}
          meta={[{ name: "description", content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <h1>{post.frontmatter.title}</h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: "block",
              marginBottom: rhythm(1)
            }}
          >
            {post.frontmatter.date}
          </p>
          <div
            style={{
              maxWidth: rhythm(24)
            }}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
        <hr
          style={{
            marginBottom: rhythm(1)
          }}
        />
        <Bio />

        <ul
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            listStyle: "none",
            maxWidth: rhythm(24),
            marginLeft: 0
          }}
        >
          <li
            style={{
              paddingRight: rhythm(1 / 2),
              marginLeft: "auto"
            }}
          >
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li
            style={{
              paddingLeft: rhythm(1 / 2),
              marginRight: "auto"
            }}
          >
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>

        <div
          style={{
            width: "100%"
          }}
        >
          <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </div>
        <Copyright />
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const postQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
