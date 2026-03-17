const adminService = require('../src/services/admin.service');
const prisma = require('../src/config/db');

async function testCreateUser() {
  try {
    console.log('Testing teacher registration...');
    const result = await adminService.createUser({
      email: 'test-teacher@eway.com',
      role: 'teacher',
      firstName: 'Test',
      lastName: 'Teacher',
      phone: '0771234567'
    }, {
      ipAddress: '127.0.0.1',
      userAgent: 'TestScript'
    });

    console.log('User created:', result);

    // Wait 1 second to allow email to "send"
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check PasswordResetToken table
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        user: { email: 'test-teacher@eway.com' },
        status: 'PENDING'
      }
    });

    if (token) {
      console.log('Setup token found in database:', token.token);
      const setupUrl = `http://localhost:5173/?page=setup-password&token=${token.token}&email=test-teacher@eway.com`;
      console.log('Constructed Setup URL:', setupUrl);
    } else {
      console.error('Setup token NOT found in database!');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

testCreateUser();
