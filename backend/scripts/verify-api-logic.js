const prisma = require('../src/config/db');
const authService = require('../src/services/auth.service');
const adminService = require('../src/services/admin.service');

async function testServiceLogic() {
  try {
    const email = 'test-teacher-api-final@eway.com';

    console.log('1. Creating teacher...');
    await adminService.createUser({
      email,
      role: 'teacher',
      firstName: 'API',
      lastName: 'Test',
      phone: '0773334445'
    }, { ipAddress: '127.0.0.1', userAgent: 'Test' });

    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: { user: { email }, status: 'PENDING' }
    });
    
    if (!tokenRecord) throw new Error('Token not generated');
    
    const token = tokenRecord.token;
    console.log('2. Token generated:', token);

    console.log('3. Verifying setup token...');
    const verifyResult = await authService.verifySetupToken({ email, token });
    console.log('Verify result:', verifyResult);

    console.log('4. Setting password...');
    const setupResult = await authService.setupPassword({
      email,
      token,
      password: 'NewPassword123!',
      confirmPassword: 'NewPassword123!'
    }, { ipAddress: '127.0.0.1', userAgent: 'Test' });
    console.log('Setup result:', setupResult);

    console.log('5. Verifying user can login...');
    const loginResult = await authService.login({ email, password: 'NewPassword123!' }, { ipAddress: '127.0.0.1', userAgent: 'Test' });
    console.log('Login successful for new user!');

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
}

testServiceLogic();
