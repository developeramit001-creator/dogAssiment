const fs = require('fs');
const path = require('path');

const gradlewPath = path.join(
  process.cwd(),
  'android',
  'gradlew'
);

if (fs.existsSync(gradlewPath)) {
  fs.chmodSync(gradlewPath, 0o755);
  console.log('Gradle wrapper execute permission ensured.');
} else {
  console.log('android/gradlew not found.');
}