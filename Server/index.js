const app = require('./src/app')
const { getConnection } = require('./src/config/db')

const port = process.env.PORT || 7777


app.listen(port, async () => {
    await getConnection();
    console.log(`Sever is running on http://localhost:${port}`)
});