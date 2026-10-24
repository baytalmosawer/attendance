const { execSync } = require('child_process');

const target = process.env.APP_TARGET || 'api';

if (target === 'web') {
  execSync('npm run build -w @attendance/web', { stdio: 'inherit' });
} else {
  execSync('npm run prisma:generate -w @attendance/api', { stdio: 'inherit' });
}
