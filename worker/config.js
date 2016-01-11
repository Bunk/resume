module.exports = {
    // Server
    port: process.env.API_PORT || 3000,
    // Services
    messaging: {
        user: process.env.RABBIT_USER || 'admin',
        password: process.env.RABBIT_PASSWORD || 'password',
        server: process.env.RABBIT_SERVER || 'docker'
    },
    api: {
        key: process.env.API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NWZiZDQ1YS0zZTFjLTQyNTgtOTI1Yi03NTk1YzBkOWE0NDgiLCJpYXQiOjE0NTE3NDc5MzE1NzUsInN1YiI6IjEwOTg2MTI4NDIzNjg0MTgzMzkxOSIsInNjb3BlcyI6eyJzeXN0ZW0iOiJ0cnVlIiwiY29udmVyc2lvbnMiOnsiYWN0aW9ucyI6WyJyZWFkIiwibW9kaWZ5Il19LCJyZXN1bWVzIjp7ImFjdGlvbnMiOlsicmVhZCIsIm1vZGlmeSJdfX19.cbUIOqKpn5P-0fe15uOYp0ajyUt-QfD5pMGrzDRrnCU',
        conversions: process.env.API_RESUMES_URL || 'http://localhost:3000/conversions',
        documents: process.env.API_DOCUMENTS_URL || 'http://localhost:3000/resumes'
    }
};
