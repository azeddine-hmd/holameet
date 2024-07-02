#!/bin/bash

npx next telemetry disable >/dev/null

if [ "$NODE_ENV" == "production" ]; then
	npm run build
	npm run start2
else
	npm run dev2
fi
