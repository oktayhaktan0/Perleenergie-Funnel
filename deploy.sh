#!/bin/bash

# Renkler
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}>>> Deployment paketi hazirlaniyor...${NC}"

# 1. Build al
echo -e "${BLUE}>>> Next.js build aliniyor...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}xxx Build hatasi olustu! Paketi kontrol et.${NC}"
    exit 1
fi

# 2. Gecici klasor olustur
echo -e "${BLUE}>>> Klasorler duzenleniyor...${NC}"
rm -rf deploy_package
mkdir -p deploy_package

# 3. Standalone dosyalarini kopyala
cp -r .next/standalone/* deploy_package/
cp -r .next/standalone/.next deploy_package/ 2>/dev/null || true

# 4. Statik dosyalari (CSS/JS) doğru yere tasi (Hostinger uyumu için)
echo -e "${BLUE}>>> Hostinger uyumlu klasor yapisi kuruluyor...${NC}"
mkdir -p deploy_package/public/_next/static
cp -r .next/static/* deploy_package/public/_next/static/

# 5. Public klasorunu kopyala
cp -r public/* deploy_package/public/

# 6. Gereksiz dosyalari temizle
rm -f deploy_package/deploy.sh
rm -rf deploy_package/.DS_Store

# 7. Ziple
echo -e "${BLUE}>>> Zipleniyor...${NC}"
rm -f hostinger_deploy.zip
cd deploy_package && zip -r ../hostinger_deploy.zip . * -q
cd ..

# 8. Temizlik
rm -rf deploy_package

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN} BAŞARILI! ${NC}"
echo -e "${GREEN}=============================================${NC}"

