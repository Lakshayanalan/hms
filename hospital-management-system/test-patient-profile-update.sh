#!/bin/bash

echo "Testing Patient Profile Update Functionality"
echo "=============================================="

# Backend URL
BASE_URL="http://localhost:8080/api"

# First, login as a patient to get a token
echo "1. Logging in as patient..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "prakash.j",
    "password": "patient123"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get authentication token"
    exit 1
fi

echo "✅ Successfully obtained token: ${TOKEN:0:20}..."

# Get patient data first
echo "2. Getting patient data..."
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"userId":[^,}]*' | cut -d':' -f2)
echo "User ID: $USER_ID"

# Get patient info
PATIENT_RESPONSE=$(curl -s -X GET "$BASE_URL/patients/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Patient data response: $PATIENT_RESPONSE"

# Extract patient ID
PATIENT_ID=$(echo $PATIENT_RESPONSE | grep -o '"patientId":[^,}]*' | cut -d':' -f2)
echo "Patient ID: $PATIENT_ID"

# Test 1: Update user profile
echo "3. Testing user profile update..."
PROFILE_UPDATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$BASE_URL/users/$USER_ID/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Prakash Updated",
    "lastName": "Johnson Updated",
    "email": "prakash.updated@example.com",
    "phone": "9876543210"
  }')

HTTP_STATUS=$(echo "$PROFILE_UPDATE_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$PROFILE_UPDATE_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "User profile update - HTTP Status: $HTTP_STATUS"
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ User profile update successful"
else
    echo "❌ User profile update failed"
fi

# Test 2: Update patient data  
echo "4. Testing patient data update..."
PATIENT_UPDATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$BASE_URL/patients/$PATIENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "prakash.j",
    "email": "prakash.updated@example.com", 
    "firstName": "Prakash Updated",
    "lastName": "Johnson Updated",
    "phone": "9876543210",
    "gender": "Male",
    "dateOfBirth": "1985-03-15",
    "bloodType": "O+",
    "address": "123 Updated Street, Updated City",
    "allergies": "None",
    "emergencyContact": "Jane Johnson Updated",
    "emergencyPhone": "1234567890"
  }')

HTTP_STATUS=$(echo "$PATIENT_UPDATE_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$PATIENT_UPDATE_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "Patient data update - HTTP Status: $HTTP_STATUS"  
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Patient data update successful"
else
    echo "❌ Patient data update failed"
fi

# Test 3: Password change
echo "5. Testing password change..."
PASSWORD_UPDATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$BASE_URL/users/$USER_ID/password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "patient123",
    "newPassword": "newpatient123"
  }')

HTTP_STATUS=$(echo "$PASSWORD_UPDATE_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$PASSWORD_UPDATE_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "Password change - HTTP Status: $HTTP_STATUS"
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Password change successful"
    
    # Change password back for future tests
    echo "6. Changing password back to original..."
    curl -s -X PUT "$BASE_URL/users/$USER_ID/password" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "currentPassword": "newpatient123",
        "newPassword": "patient123"
      }' > /dev/null
    echo "✅ Password restored"
else
    echo "❌ Password change failed"
fi

echo ""
echo "=============================================="
echo "Patient Profile Update Test Complete"
echo "=============================================="