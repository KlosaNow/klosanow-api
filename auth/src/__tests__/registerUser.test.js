

// /*
// Test Plan:
// - test_register_user_cookie_options: Tests that cookie options are correctly set.  tags: ['edge case']
// - test_register_user_cookie_expiration: Tests that cookie expiration time is correctly set.  tags: ['edge case']
// - test_register_user_mocks: Tests that mongoose model and Twilio client can be mocked.  tags: ['general behavior']
// */



// describe('registerUser_function', () => {

//     // Tests that OTP is sent to correct phone number. 
//     it("test_send_otp_to_correct_phone_number", async () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '+1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const sendOtpServiceMock = jest.fn().mockResolvedValue('1234');
//         await registerUser(req, res, sendOtpServiceMock);
//         expect(sendOtpServiceMock).toHaveBeenCalledWith(expect.any(String), '+1234567890');
//     });

//     // Tests that a new user is created and OTP is sent when all required fields are provided. 
//     it("test_register_user_with_all_fields", async () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '+1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const sendOtpServiceMock = jest.fn().mockResolvedValue('1234');
//         await registerUser(req, res, sendOtpServiceMock);
//         expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//         expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'User created successfully. OTP sent' });
//     });

//     // Tests that bad request error is thrown when required fields are missing. 
//     it("test_register_user_missing_fields", async () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const sendOtpServiceMock = jest.fn().mockResolvedValue('1234');
//         await expect(registerUser(req, res, sendOtpServiceMock)).rejects.toThrow('Please provide all required fields');
//     });

//     // Tests that bad request error is thrown when user with same email or phone number already exists. 
//     it("test_register_user_already_exists", async () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '+1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const sendOtpServiceMock = jest.fn().mockResolvedValue('1234');
//         User.findOne = jest.fn().mockResolvedValue({ email: 'test@test.com', phoneNumber: '+1234567890' });
//         await expect(registerUser(req, res, sendOtpServiceMock)).rejects.toThrow('User with that email or phone number already exists');
//     });

//     // Tests that cookies are attached to response. 
//     it("test_register_user_attach_cookies", async () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '+1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const sendOtpServiceMock = jest.fn().mockResolvedValue('1234');
//         await registerUser(req, res, sendOtpServiceMock);
//         expect(res.cookie).toHaveBeenCalledWith('accessToken', expect.any(String), expect.any(Object));
//     });

//     // Tests that success response with message is returned. 
//     it("test_register_user_success_response", async () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '+1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const sendOtpServiceMock = jest.fn().mockResolvedValue('1234');
//         await registerUser(req, res, sendOtpServiceMock);
//         expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'User created successfully. OTP sent' });
//     });

//     // Tests that cookie options are correctly set.  
//     it("test_register_user_cookie_options", () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
//         const attachCookiesToResponseMock = jest.fn();
//         const UserMock = { findOne: jest.fn().mockReturnValue(null), create: jest.fn().mockReturnValue({ _id: '123' }) };
//         const sendOtpServiceMock = jest.fn();
//         const badRequestErrorMock = jest.fn();

//         registerUser(req, res, attachCookiesToResponseMock, UserMock, sendOtpServiceMock, badRequestErrorMock);

//         expect(attachCookiesToResponseMock).toHaveBeenCalledWith({ res, user: { _id: '123' } });
//         expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//         expect(res.json).toHaveBeenCalledWith(successRes('User created successfully. OTP sent'));
//     });

//     // Tests that cookie expiration time is correctly set.  
//     it("test_register_user_cookie_expiration", () => {
//         const req = { body: { email: 'test@test.com', name: 'Test User', phoneNumber: '1234567890' } };
//         const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), cookie: jest.fn() };
//         const attachCookiesToResponseMock = jest.fn(({ res }) => {
//             res.cookie('accessToken', 'testToken', { maxAge: 3600000 });
//             res.cookie('refreshToken', 'testToken', { expires: new Date(Date.now() + 86400000) });
//         });
//         const UserMock = { findOne: jest.fn().mockReturnValue(null), create: jest.fn().mockReturnValue({ _id: '123' }) };
//         const sendOtpServiceMock = jest.fn();
//         const badRequestErrorMock = jest.fn();

//         registerUser(req, res, attachCookiesToResponseMock, UserMock, sendOtpServiceMock, badRequestErrorMock);

//         expect(res.cookie).toHaveBeenCalledWith('accessToken', 'testToken', { maxAge: 3600000 });
//         expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'testToken', { expires: expect.any(Date) });
//     });
// });
