#!/usr/bin/env sh

# Build HR-Roster

GREEN='\033[0;32m'
NC='\033[0m' # No Color
cwd=$(pwd)
cu=$(logname)

echo "**************************************"
echo "STEP 1/6: rm -r public/js/prod/chunks/"
echo "**************************************"
if rm -r public/js/prod/chunks/ ; then
	echo -e "${GREEN}Done.${NC}"
fi

echo ""

echo "**************************"
echo "STEP 2/6: composer install"
echo "**************************"
composer install

echo ""

echo "*********************"
echo "STEP 3/6: npm install"
echo "*********************"
npm install

echo ""

echo "****************************"
echo "STEP 4/6: npm run production"
echo "****************************"
npm run production

echo ""

echo "*****************************"
echo "STEP 5/6: php artisan migrate"
echo "*****************************"
php artisan migrate

echo ""

# Adjust HR-Roster's permissions
echo "******************************************************************"
echo "STEP 6/6: chown -R www-data:www-data $cwd"
echo "******************************************************************"
if chown -R www-data:www-data $cwd ; then
	echo -e "${GREEN}Done.${NC}"
fi

echo ""
