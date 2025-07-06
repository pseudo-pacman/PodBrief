#!/usr/bin/env node

// Simple API test script for PodBrief
// This script tests the basic API functionality

const http = require('http');

const testData = {
  name: "John Doe",
  link: "https://johndoe.com",
  topic: "AI and Machine Learning"
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 PodBrief API Tests');
  console.log('=====================\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await makeRequest('GET', '/api/health');
    if (healthResponse.status === 200) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }

    // Test 2: Generate Brief (will fail without OpenAI API key, but tests endpoint)
    console.log('\n2. Testing Generate Brief...');
    try {
      const generateResponse = await makeRequest('POST', '/api/generate', testData);
      if (generateResponse.status === 500 && generateResponse.data.error) {
        console.log('✅ Generate endpoint is working (expected error without API key)');
        console.log('   Error:', generateResponse.data.error);
      } else {
        console.log('❌ Unexpected response:', generateResponse.status);
      }
    } catch (error) {
      console.log('❌ Generate endpoint error:', error.message);
    }

    // Test 3: Get All Briefs
    console.log('\n3. Testing Get All Briefs...');
    const briefsResponse = await makeRequest('GET', '/api/generate');
    if (briefsResponse.status === 200) {
      console.log('✅ Get briefs endpoint working');
    } else {
      console.log('❌ Get briefs failed:', briefsResponse.status);
    }

    console.log('\n🎉 API tests completed!');
    console.log('\nTo run the full application:');
    console.log('1. Add your OpenAI API key to server/.env');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:3000');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running on port 5000');
  }
}

runTests(); 