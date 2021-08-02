exports.createPages = ({ actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: `/`,
    toPath: `/maps`,
    redirectInBrowser: true,
    isPermanent: true,
  });
};
