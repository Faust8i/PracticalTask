const config = {
    port:                   process.env.port || 4000,
    level_hashing_password: 7,
    secret_jwt_key:         'OVER_SECRET_KEY',
    expiresIn_jwt:          60*30,
    def_page_num:           0,
    def_page_size:          3
}

export default config