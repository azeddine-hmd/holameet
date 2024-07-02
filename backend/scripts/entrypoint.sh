#!/bin/bash

if [ "$NODE_ENV" == "production" ]; then
	npm run build
	npm run start2
else
	npm run dev2
fi
