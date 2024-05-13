module.exports = {
  apps : [{
    name   : "boost.kapitalboost.com",
    exec_mode: 'cluster',
    instances: 'max',
    script : "node_modules/next/dist/bin/next",
    args: 'start',
    env_dev: {
         APP_ENV: 'dev', // APP_ENV=dev
    },
    env_prod: {
         APP_ENV: 'prod', // APP_ENV=prod
    }
  }]
}
