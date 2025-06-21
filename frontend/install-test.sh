npm install -f
npm run build-test

pm2 delete blueberrysgrill-v2-site-next:5012
pm2 start npm --name "blueberrysgrill-v2-site-next:5012" -- run start-test --attach
pm2 save --force