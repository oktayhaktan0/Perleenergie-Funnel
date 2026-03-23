#!/bin/bash

# Renkler
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}>>> Kaynak kod paketi (Source Code) hazirlaniyor...${NC}"

rm -f hostinger_source.zip

# Sadece gereken kaynak dosyalari zip'le
zip -r hostinger_source.zip \
  src/ \
  public/ \
  package.json \
  package-lock.json \
  next.config.mjs \
  tsconfig.json \
  postcss.config.mjs \
  eslint.config.mjs \
  .env.example \
  database_schema.sql \
  reviews_schema.sql \
  setup_blog_schema.js \
  -x "*/node_modules/*" -x "*/.next/*" -x "*/.git/*" -q

echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN} BAŞARILI! 'hostinger_source.zip' oluşturuldu.${NC}"
echo -e "${GREEN}=============================================${NC}"
