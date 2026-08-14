#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Invecho Local Environment Setup${NC}"

# Check for root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

HOSTS_FILE="/etc/hosts"
DOMAINS=("app.invecho.local" "api.invecho.local" "redis.invecho.local" "inspector.invecho.local" "proxy.invecho.local")

for domain in "${DOMAINS[@]}"; do
    if ! grep -q "$domain" "$HOSTS_FILE"; then
        echo -e "${BLUE}Adding $domain to hosts...${NC}"
        echo "127.0.0.1 $domain" >> "$HOSTS_FILE"
    else
        echo -e "${GREEN}$domain already exists in hosts.${NC}"
    fi
done

echo -e "${BLUE}Building Docker images...${NC}"
docker compose build

echo -e "${BLUE}Starting Docker containers...${NC}"
docker compose up -d

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN} Invecho Environment is UP!               ${NC}"
echo -e "${GREEN}==========================================${NC}"
echo -e "Frontend:    http://app.invecho.local"
echo -e "Backend:     http://api.invecho.local"
echo -e "Redis UI:    http://redis.invecho.local"
echo -e "Inspector:   http://inspector.invecho.local"
echo -e "Traefik UI:  http://proxy.invecho.local"
echo -e "${GREEN}==========================================${NC}"
