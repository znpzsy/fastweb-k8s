const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
    serverUrl: 'http://10.35.36.55:9000',
    options: {
        'sonar.projectName': 'A3GW',
	'sonar.projectVersion': '2.0',
        'sonar.projectDescription': 'Gateway application for web applications developed as single page.',
        'sonar.sources': 'src',
        'sonar.tests': 'src',
        'sonar.inclusions': '**', // Entry point of your code
        'sonar.test.inclusions': 'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx'
    }
}, () => process.exit());
