module.exports = function (/* ctx */) {
  return {
    devServer: {
      port: 9000,
      open: true, // opens browser window automatically
    },
    framework: {
      config: {
        brand: {
          primary: '#027be3',
        },
      },
    },
    pwa: {
      manifest: {
        name: `EvIDukacija`,
        short_name: `EvIDukacija`,
        description: `EvIDukacija Application`,
      },
    },
  }
}
