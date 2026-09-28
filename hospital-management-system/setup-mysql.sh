#!/bin/bash

echo "=== MySQL Database Setup for Hospital Management System ==="
echo ""
echo "Please enter your MySQL root password when prompted."
echo ""

# Create database
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE 'hospital_db';
SELECT 'Database hospital_db created successfully!' AS Status;
EXIT;
EOF

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. The database 'hospital_db' has been created"
echo "2. Run: cd backend && mvn clean install && mvn spring-boot:run"
echo ""
