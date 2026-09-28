#!/bin/bash

echo "Testing Medical Records API with Authentication..."

# Test 1: Check if backend is running
echo "1. Testing backend connection..."
curl -s http://localhost:8080/api/users/role/doctor > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Backend is running"
else
    echo "✗ Backend is not responding"
    exit 1
fi

# Test 2: Login as doctor to get JWT token
echo "2. Authenticating as doctor..."
auth_response=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor1",
    "password": "doctor123"
  }')

echo "Auth response: $auth_response"

# Extract JWT token from response
token=$(echo $auth_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$token" ]; then
    echo "✗ Failed to get authentication token"
    exit 1
fi

echo "✓ Got JWT token: ${token:0:50}..."

# Test 3: Get patients with auth
echo "3. Testing GET patients with auth..."
patients=$(curl -s -H "Authorization: Bearer $token" http://localhost:8080/api/patients)
echo "Patients response: $patients"

# Test 4: Create medical record with auth
echo "4. Testing POST medical record with auth..."
response=$(curl -v -X POST http://localhost:8080/api/medical-records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "patientId": 1,
    "doctorId": 2,
    "title": "Test Medical Record",
    "recordDate": "2025-09-22T10:00:00.000Z",
    "chiefComplaint": "Test complaint",
    "diagnosis": "Test diagnosis"
  }' 2>&1)

echo "Medical record creation response: $response"

echo "API testing completed."