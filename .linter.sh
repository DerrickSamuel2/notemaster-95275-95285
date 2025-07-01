#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-95275-95285/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

