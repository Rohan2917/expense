/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

// module.exports = {
//   trailingSlash: true,
//   reactStrictMode: false,
//   webpack: config => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
//     }

//     return config
//   }
// }
/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@mui/x-data-grid'],
  webpack: config => {
    config.module.rules.push({
      test: /\.css$/,
      include: /node_modules\/@mui\/x-data-grid/,
      use: ['style-loader', 'css-loader']
    })
    return config
  }
}
