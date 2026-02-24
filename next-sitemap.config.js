/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // TODO: Change to your production domain
  siteUrl: process.env.SITE_URL || "https://yourapp.com",
  generateRobotsTxt: true,

  // Exclude private routes and metadata files from sitemap
  exclude: [
    "/login",
    "/api/*",
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
  ],
};
