import express     from "express"
import bodyParser  from "body-parser"
import router      from "./router.js"
import config      from "./config.js"

const app  = express()
const PORT = config.port

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', router)

const start = () => {
    try {
        app.listen(PORT, () => { console.log(`Server started on port ${PORT}.`) })
    } catch (error) {
        console.log(error)
    }
}

start()