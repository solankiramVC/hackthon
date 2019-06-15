module.exports = {
  development: {
    port: 4000, // assign your own port no
    mongoUri: 'mongodb://192.168.1.195:27017/hackthon',
    adminUri: 'http://localhost:4200/',
    masterAdminUri: 'https://quickwalk-admin.viitorcloud.in/',
    userUri: 'http://localhost:4200/',
    logs: 'dev'
  },
  production: {
    port: 3000, // assign your own port no
    mongoUri: 'mongodb://localhost:27017/quickWalk',
    adminUri: 'http://business.quickwalk.com/',
    masterAdminUri: 'http://admin.quickwalk.com/',
    userUri: 'http://quickwalk.com/',
    logs: 'combined'
  },
  test: {
    port: 3000, /* assign your own port no */
    mongoUri: 'mongodb://localhost:27017/quickWalk',
    adminUri: 'http://localhost:4200/',
    masterAdminUri: 'https://quickwalk-admin.viitorcloud.in/',
    userUri: 'http://localhost:4200/',
    logs: 'dev'
  }
};

