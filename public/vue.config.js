module.exports = {
    
    devServer: {
        proxy: 'http://localhost:5000' // enter dev server url here 
      },
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
}