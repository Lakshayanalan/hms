#!/bin/bash

# Test API endpoints for patient access during billing
BASE_URL="http://localhost:8080/api"

echo "🔍 Testing Patient Access in Billing Workflow"
echo "=============================================="

# First login as admin to create a receptionist and some test data
echo "1️⃣ Logging in as admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Admin token: $ADMIN_TOKEN"

# Create receptionist user
echo "2️⃣ Creating receptionist user..."
RECEPTIONIST_REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "username": "receptionist_test", 
    "password": "receptionist123", 
    "email": "receptionist_test@hospital.com", 
    "firstName": "Test", 
    "lastName": "Receptionist", 
    "phone": "+1234567890", 
    "role": "RECEPTIONIST"
  }')

echo "$RECEPTIONIST_REGISTER"

# Login as receptionist
echo "3️⃣ Logging in as receptionist..."
RECEPTIONIST_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "receptionist_test", "password": "receptionist123"}')

RECEPTIONIST_TOKEN=$(echo "$RECEPTIONIST_LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Receptionist token: $RECEPTIONIST_TOKEN"

# Test patient list access (the main issue)
echo "4️⃣ Testing patient list access as receptionist..."
PATIENT_LIST_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" \
  -H "Authorization: Bearer $RECEPTIONIST_TOKEN" \
  "$BASE_URL/patients")

echo "Patient List Response:"
echo "$PATIENT_LIST_RESPONSE"

# Test specific patient endpoint
echo "5️⃣ Testing patients with pagination..."
PATIENT_PAGINATED=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" \
  -H "Authorization: Bearer $RECEPTIONIST_TOKEN" \
  "$BASE_URL/patients?page=0&size=10")

echo "Paginated Patients Response:"
echo "$PATIENT_PAGINATED"

# Test search endpoint
echo "6️⃣ Testing patient search..."
PATIENT_SEARCH=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" \
  -H "Authorization: Bearer $RECEPTIONIST_TOKEN" \
  "$BASE_URL/patients/search?query=test")

echo "Patient Search Response:"
echo "$PATIENT_SEARCH"

# Test invoices endpoint (for billing)
echo "7️⃣ Testing invoices access..."
INVOICES_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" \
  -H "Authorization: Bearer $RECEPTIONIST_TOKEN" \
  "$BASE_URL/invoices")

echo "Invoices Response:"
echo "$INVOICES_RESPONSE"

echo "=============================================="
echo "✅ Test completed! Check responses for any authorization issues."