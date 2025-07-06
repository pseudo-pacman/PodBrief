// Test script to verify routing setup
console.log('🧪 Testing PodBrief Routing Setup...\n');

// Test 1: Check if components can be imported
console.log('1️⃣ Testing component imports...');
try {
  const React = require('react');
  const { BrowserRouter, Routes, Route } = require('react-router-dom');
  console.log('✅ React Router imported successfully');
} catch (error) {
  console.log('❌ React Router import failed:', error.message);
}

// Test 2: Check if main components exist
console.log('\n2️⃣ Testing component files...');
const fs = require('fs');
const path = require('path');

const components = [
  'src/App.js',
  'src/LandingPage.js', 
  'src/MainApp.js'
];

components.forEach(component => {
  const filePath = path.join(__dirname, component);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${component} exists`);
  } else {
    console.log(`❌ ${component} missing`);
  }
});

// Test 3: Check package.json for react-router-dom
console.log('\n3️⃣ Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  if (packageJson.dependencies['react-router-dom']) {
    console.log('✅ react-router-dom is installed');
  } else {
    console.log('❌ react-router-dom is not installed');
  }
} catch (error) {
  console.log('❌ Could not read package.json:', error.message);
}

// Test 4: Verify routing structure
console.log('\n4️⃣ Testing routing structure...');
try {
  const appContent = fs.readFileSync(path.join(__dirname, 'src/App.js'), 'utf8');
  
  if (appContent.includes('BrowserRouter')) {
    console.log('✅ BrowserRouter is configured');
  } else {
    console.log('❌ BrowserRouter is not configured');
  }
  
  if (appContent.includes('Route path="/"')) {
    console.log('✅ Landing page route (/) is configured');
  } else {
    console.log('❌ Landing page route (/) is missing');
  }
  
  if (appContent.includes('Route path="/app"')) {
    console.log('✅ Main app route (/app) is configured');
  } else {
    console.log('❌ Main app route (/app) is missing');
  }
  
  if (appContent.includes('LandingPage')) {
    console.log('✅ LandingPage component is imported');
  } else {
    console.log('❌ LandingPage component is not imported');
  }
  
  if (appContent.includes('MainApp')) {
    console.log('✅ MainApp component is imported');
  } else {
    console.log('❌ MainApp component is not imported');
  }
  
} catch (error) {
  console.log('❌ Could not read App.js:', error.message);
}

// Test 5: Check LandingPage CTA button
console.log('\n5️⃣ Testing LandingPage CTA...');
try {
  const landingContent = fs.readFileSync(path.join(__dirname, 'src/LandingPage.js'), 'utf8');
  
  if (landingContent.includes('Link to="/app"')) {
    console.log('✅ CTA button links to /app');
  } else {
    console.log('❌ CTA button does not link to /app');
  }
  
  if (landingContent.includes('react-router-dom')) {
    console.log('✅ React Router is imported in LandingPage');
  } else {
    console.log('❌ React Router is not imported in LandingPage');
  }
  
} catch (error) {
  console.log('❌ Could not read LandingPage.js:', error.message);
}

console.log('\n🎉 Routing test completed!');
console.log('\n📋 Next steps:');
console.log('1. Start the backend: cd ../server && npm run dev');
console.log('2. Start the frontend: npm start');
console.log('3. Visit http://localhost:3000 to see the landing page');
console.log('4. Click "Get Started Free" to navigate to /app');
console.log('5. Test navigation between routes'); 