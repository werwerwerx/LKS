#!/bin/bash

echo "Building Next.js app..."
cd app && npm run build && cd ..

echo "Starting services with PM2..."
pm2 start ecosystem.config.js

echo "Services started!"
pm2 status 