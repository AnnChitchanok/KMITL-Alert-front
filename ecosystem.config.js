module.exports = {
    apps: [{
        name: 'KMITL-ALERT',
        port: 3000,
        script: 'react-scripts start',
        args: 'start',
        instances: 1,
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
        min_uptime: 10000
    }]
}