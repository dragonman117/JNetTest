#!/usr/bin/env bash
echo "Createing Docker Image"
docker build -t 'code-compiler' - < Dockerfile
echo "Getting Installed Docker Images"
docker images