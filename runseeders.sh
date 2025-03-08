#!/bin/bash

# Run all seeders using Sequelize CLI
npx sequelize-cli db:seed:all

echo "Seeders have been run successfully." 