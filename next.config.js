/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    adminprivatekey_1: process.env.GROUP_ADMIN_PRIVATE_KEY_1,
    infuraApiKey: process.env.INFURA_API_KEY,
    alchemyKey: process.env.ALCHEMY_APIKEY,
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
        config.plugins.push(
            new webpack.ProvidePlugin({
                global: "global"
            })
        )

        config.resolve.fallback = {
            fs: false,
            stream: false,
            crypto: false,
            os: false,
            readline: false,
            ejs: false,
            assert: require.resolve("assert"),
            path: false
        }

        return config
    }

    return config
}
}

module.exports = nextConfig
