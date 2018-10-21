const _ = require("lodash");
const Promise = require("bluebird");
const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve("./src/templates/blog-post.js");
    const page = path.resolve("./src/templates/page.js");

    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  fileAbsolutePath
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const allItems = result.data.allMarkdownRemark.edges;

        const pages = allItems.filter(post => {
          return post.node.fileAbsolutePath.includes("/page/");
        });

        const posts = allItems.filter(post => {
          return post.node.fileAbsolutePath.includes("/post/");
        });

        _.each(posts, (post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;
          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next
            }
          });
        });

        _.each(pages, post => {
          createPage({
            path: post.node.fields.slug,
            component: page,
            context: {
              slug: post.node.fields.slug
            }
          });
        });
      })
    );
  });
};
