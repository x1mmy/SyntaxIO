import { connectDB } from '../config/database';
import User from '../models/User';
import Search from '../models/Search';
import Cache from '../models/Cache';

// Test function for User model
async function testUserModel() {
    try {
        // Create a test user
        const testUser = new User({
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser'
        });

        // Save the user
        await testUser.save();
        console.log('Test user created:', testUser);

        // Test password comparison
        const isMatch = await testUser.comparePassword('password123');
        console.log('Password match test:', isMatch);

        // Find the user
        const foundUser = await User.findOne({ email: 'test@example.com' });
        console.log('Found user:', foundUser);

    } catch (error) {
        console.error('User test error:', error);
    }
}

// Test function for Search model
async function testSearchModel() {
    try {
        // First get a user to reference
        const user = await User.findOne({ email: 'test@example.com' });
        if (!user) throw new Error('Test user not found');

        // Create a test search
        const testSearch = new Search({
            userId: user._id,
            query: 'test query',
            context: 'test context',
            results: [{
                source: 'test source',
                content: 'test content',
                relevanceScore: 0.95
            }]
        });

        await testSearch.save();
        console.log('Test search created:', testSearch);

    } catch (error) {
        console.error('Search test error:', error);
    }
}

// Test function for Cache model
async function testCacheModel() {
    try {
        // Create a test cache entry
        const testCache = new Cache({
            key: 'test-key',
            data: { someData: 'test data' },
            expiresAt: new Date(Date.now() + 3600000) // expires in 1 hour
        });

        await testCache.save();
        console.log('Test cache created:', testCache);

    } catch (error) {
        console.error('Cache test error:', error);
    }
}

// Main test function
async function runTests() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Run tests
        await testUserModel();
        await testSearchModel();
        await testCacheModel();

        // Optional: Clean up test data
        // await User.deleteOne({ email: 'test@example.com' });
        
        console.log('All tests completed');
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        // Disconnect from database
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }
}

// Run the tests
runTests();