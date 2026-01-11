#!/bin/bash

# ================================================
# Docker Build Script for Weather App (Production)
# 
# Usage:
#   ./docker-build.sh
#
# Prerequisites:
#   Base image must be built first (run once or when dependencies change):
#   docker build -f Dockerfile-fe-base -t fsd-weather-base:latest .
#
# Optional: Set Discord webhook for build notifications
#   export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
#   ./docker-build.sh
# ================================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Docker Build Script for Weather App${NC}"
echo -e "${GREEN}================================================${NC}"

# Base 이미지 존재 확인
echo -e "\n${YELLOW}Checking base image...${NC}"
if ! docker images fsd-weather-base:latest | grep -q fsd-weather-base; then
  echo -e "${RED}✗ Base image not found!${NC}"
  echo -e "${YELLOW}Please build the base image first:${NC}"
  echo -e "  docker build -f Dockerfile-fe-base -t fsd-weather-base:latest ."
  exit 1
fi
echo -e "${GREEN}✓ Base image found${NC}"

# Production 이미지 빌드
echo -e "\n${YELLOW}Building production image...${NC}"

# Discord webhook URL (선택사항 - 비워두면 알림 없이 빌드)
DISCORD_WEBHOOK="${DISCORD_WEBHOOK_URL:-}"

docker build \
  -f Dockerfile-prod \
  -t fsd-weather-prod:latest \
  --build-arg BASE_IMAGE_FE="fsd-weather-base:latest" \
  --build-arg APP_ENV="production" \
  --build-arg NODE_OPTIONS="--max-old-space-size=2048" \
  --build-arg DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK" \
  .

if [ $? -ne 0 ]; then
  echo -e "${RED}✗ Production image build failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Production image built successfully${NC}"

# 이미지 크기 확인
echo -e "\n${YELLOW}Image sizes:${NC}"
docker images | grep fsd-weather

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}  Build completed successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "\nTo run the application:"
echo -e "  ${YELLOW}docker run -p 3000:3000 fsd-weather-prod:latest${NC}"
