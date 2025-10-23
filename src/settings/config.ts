export const configuration = async () => {
    return {
        environment: process.env.NODE_ENV || 'development',
        api: {
            port: process.env.API_PORT,
            secret: process.env.JWT_API_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
        database: {
            db_name: process.env.DB_NAME,
            db_username: process.env.DB_USERNAME,
            db_password: process.env.DB_PASSWORD,
        },
        cors: {
            origin: process.env.ALLOWED_ORIGIN?.split(','),
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
                'Authorization',
            ],
        },
    };
};
