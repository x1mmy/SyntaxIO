import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3000/api/auth';

// Store the token for authenticated requests
let authToken: string;

// Test user data
const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
};

// Test the authentication flow
async function testAuthFlow() {
    try {
        // 1. Test Registration
        console.log('\n🔍 Testing User Registration...');
        const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
        console.log('✅ Registration successful:', registerResponse.data);

    } catch (error: any) {
        if (error.response?.data.message === 'User already exists') {
            console.log('Note: Test user already exists, proceeding to login...');
        } else {
            console.error('❌ Registration error:', error.response?.data || error.message);
            return;
        }
    }

    try {
        // 2. Test Login
        console.log('\n🔍 Testing User Login...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginResponse.data.token;
        console.log('✅ Login successful:', loginResponse.data);

        // 3. Test Profile Access
        console.log('\n🔍 Testing Profile Access...');
        const profileResponse = await axios.get(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Profile access successful:', profileResponse.data);

    } catch (error: any) {
        console.error('❌ Test error:', error.response?.data || error.message);
    }
}

testAuthFlow();