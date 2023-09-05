module.exports = {
  devServer: {
    static: [
      { 
        directory: './documentation', 
        publicPath: '/docs/ng'
      },

      { 
        directory: './sassdoc', 
        publicPath: '/docs/sass'
      }
    ]
  }
};