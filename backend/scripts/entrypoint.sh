#!/bin/bash

if [ "$NODE_ENV" == "production" ]; then
	npm run build
	npm run start
else
	npm run dev2
fi
