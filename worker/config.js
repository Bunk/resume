module.exports = {
    // Server
    port                : process.env.API_PORT || 3000,

    // Services
    rabbit: {
        url             : process.env.RABBIT_URL || 'amqp://admin:password@docker'
    },

    api: {
        conversions     : process.env.API_RESUMES_URL || 'http://localhost:3000/conversions',
        conversionsKey  : process.env.API_RESUMES_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NWZiZDQ1YS0zZTFjLTQyNTgtOTI1Yi03NTk1YzBkOWE0NDgiLCJpYXQiOjE0NTE3NDc5MzE1NzUsInN1YiI6IjEwOTg2MTI4NDIzNjg0MTgzMzkxOSIsInNjb3BlcyI6eyJjb252ZXJzaW9ucyI6eyJzeXN0ZW0iOiJ0cnVlIiwiYWN0aW9ucyI6WyJjcmVhdGUiLCJkZWxldGUiXX19fQ.35IE_GRkidE4SmiieD4aNA5D6xHWkul1VwyjnCyoY08'
    }
};
