const axios = require('axios');

// Test the new API endpoint
async function testClassCoursesAndTeachers() {
  try {
    // Replace 'YOUR_CLASS_ID' with an actual class ID from your database
    const classId = 'YOUR_CLASS_ID'; // You'll need to replace this with a real class ID
    
    console.log('Testing API endpoint for class courses and teachers...');
    console.log(`GET /api/classes/${classId}/courses-teachers`);
    
    const response = await axios.get(`http://localhost:5000/api/classes/${classId}/courses-teachers`);
    
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Example of what the response structure looks like:
    console.log('\n📋 Response Structure:');
    console.log('{
  "class": {
    "_id": "class_id",
    "name": "10th Class"
  },
  "courses": [
    {
      "course": {
        "_id": "course_id",
        "name": "Mathematics",
        "code": "MATH101"
      },
      "teachers": [
        {
          "_id": "teacher_id",
          "name": "John Doe",
          "email": "john.doe@school.com"
        }
      ]
    }
  ]
}');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 To test this API:');
      console.log('1. First, create a class using POST /api/classes');
      console.log('2. Add courses to the class using PUT /api/classes/:id');
      console.log('3. Create teacher assignments using POST /api/teacher-assignments');
      console.log('4. Then use this endpoint with the actual class ID');
    }
  }
}

// Function to help you get a class ID for testing
async function getFirstClassId() {
  try {
    const response = await axios.get('http://localhost:5000/api/classes');
    if (response.data.length > 0) {
      console.log('Available classes:');
      response.data.forEach(cls => {
        console.log(`- ID: ${cls._id}, Name: ${cls.name}`);
      });
      return response.data[0]._id;
    } else {
      console.log('No classes found. Please create a class first.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching classes:', error.response?.data || error.message);
    return null;
  }
}

// Run the test
async function runTest() {
  console.log('🚀 Testing Class Courses and Teachers API\n');
  
  // First, try to get a class ID
  const classId = await getFirstClassId();
  
  if (classId) {
    // Update the test function to use the actual class ID
    const originalTest = testClassCoursesAndTeachers;
    testClassCoursesAndTeachers = async () => {
      try {
        console.log(`Testing with class ID: ${classId}`);
        const response = await axios.get(`http://localhost:5000/api/classes/${classId}/courses-teachers`);
        console.log('\n✅ API Response:');
        console.log(JSON.stringify(response.data, null, 2));
      } catch (error) {
        console.error('❌ Error testing API:', error.response?.data || error.message);
      }
    };
    
    await testClassCoursesAndTeachers();
  } else {
    console.log('Please create some classes first before testing this API.');
  }
}

// Export for use in other files
module.exports = { testClassCoursesAndTeachers, getFirstClassId };

// Run if this file is executed directly
if (require.main === module) {
  runTest();
} 