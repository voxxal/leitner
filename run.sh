#Prevent Collisions
killall node

cd server
yarn start &
cd ..
cd client
yarn start &
cd ..

