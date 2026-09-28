#!/bin/bash

echo "Testing Real-time Notification System..."

# Test 1: Check if backend is running
echo "1. Testing backend connection..."
curl -s http://localhost:8080/api/health > /dev/null
if [ $? -ne 0 ]; then
    curl -s http://localhost:8080/api/users/role/doctor > /dev/null
fi

if [ $? -eq 0 ]; then
    echo "✓ Backend is running"
else
    echo "✗ Backend is not responding"
    exit 1
fi

# Test 2: Login as receptionist to get JWT token
echo "2. Authenticating as receptionist..."
auth_response=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "receptionist1",
    "password": "receptionist123"
  }')

echo "Auth response: $auth_response"

# Extract JWT token from response
token=$(echo $auth_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$token" ]; then
    echo "✗ Failed to get authentication token"
    exit 1
fi

echo "✓ Got JWT token: ${token:0:50}..."

# Test 3: Get all appointments to find one to test
echo "3. Getting appointments to test notifications..."
appointments=$(curl -s -H "Authorization: Bearer $token" http://localhost:8080/api/appointments)
echo "Current appointments: $appointments"

# Test 4: Get all notifications for the user
echo "4. Testing GET notifications..."
notifications=$(curl -s -H "Authorization: Bearer $token" http://localhost:8080/api/notifications)
echo "Current notifications: $notifications"

# Test 5: Create a test appointment for notification testing
echo "5. Creating test appointment for notification testing..."
appointment_response=$(curl -s -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "patientId": 1,
    "doctorId": 2,
    "appointmentDate": "2025-09-25T10:00:00.000Z",
    "reason": "Test appointment for notifications"
  }')

echo "Appointment creation response: $appointment_response"

# Extract appointment ID from response
appointment_id=$(echo $appointment_response | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$appointment_id" ]; then
    echo "✗ Failed to create test appointment"
    exit 1
fi

echo "✓ Created appointment with ID: $appointment_id"

# Test 6: Approve the appointment (should trigger notification)
echo "6. Testing appointment approval (should trigger notification)..."
approval_response=$(curl -s -X PUT http://localhost:8080/api/appointments/$appointment_id/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "reason": "Approved for testing notification system"
  }')

echo "Approval response: $approval_response"

# Test 7: Get notifications again to see if new one was created
echo "7. Checking for new notifications after approval..."
sleep 1 # Give a moment for the notification to be processed
new_notifications=$(curl -s -H "Authorization: Bearer $token" http://localhost:8080/api/notifications)
echo "Notifications after approval: $new_notifications"

# Test 8: Reject another appointment to test rejection notifications
echo "8. Testing appointment rejection (should trigger notification)..."
rejection_response=$(curl -s -X PUT http://localhost:8080/api/appointments/$appointment_id/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "reason": "Testing rejection notification system"
  }')

echo "Rejection response: $rejection_response"

# Test 9: Final notification check
echo "9. Final notification check..."
sleep 1 # Give a moment for the notification to be processed
final_notifications=$(curl -s -H "Authorization: Bearer $token" http://localhost:8080/api/notifications)
echo "Final notifications: $final_notifications"

# Test 10: WebSocket connection info
echo "10. WebSocket endpoint info..."
echo "WebSocket endpoint: ws://localhost:8080/api/ws"
echo "To connect from frontend, use: new SockJS('http://localhost:8080/api/ws')"

echo "✓ Notification system testing completed!"
echo "Check the backend logs for WebSocket message broadcasting."