const scanner = require("sonarqube-scanner");

scanner(
    {
        serverUrl : "http://localhost:19000",
        options: {
            "sonar.projectKey": "sonar:covault-tpw-lambda-idconnect",
            "sonar.projectName": " covault-cin-tpw-lambda-idconnect",
            "sonar.projectVersion": "1.0.0",
            "sonar.sources": "./index.ts,./app/",
            "sonar.exclusions": "",
            "sonar.language": "ts",
            "sonar.sourceEncoding": "UTF-8",
            "sonar.login": "admin",
            "sonar.password": "admin",
            "sonar.typescript.lcov.reportPaths": "tests/reports/coverage/lcov.info",
            "sonar.exec.maxBuffer": "1024*1024"
        }
    },
    () => process.exit()
)