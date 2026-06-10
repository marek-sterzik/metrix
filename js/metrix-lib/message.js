import validator from "../validator.js"

const msgTypeSchema = {
    "type": "string",
    "enum": ["core", "broadcast", "query", "message", "process"]
}

const topicSchema = {
    "type": "string",
    "pattern": "^[a-zA-Z0-9_]+(\\.[a-zA-Z0-9_]+)*$",
}

const payloadSchema = {}

const messageSchema = {
    "type": "array",
    "prefixItems": [
        msgTypeSchema,
        topicSchema,
        payloadSchema
    ],
    "minItems": 3,
    "maxItems": 3,
    "items": false,
}


const messageValidator = validator(messageSchema)

class Message
{
    constructor(msgType, topic, payload)
    {
        this.msgType = msgType
        this.topic = topic
        this.payload = payload
        messageValidator.validate([this.msgType, this.topic, this.payload])
        Object.freeze(this)
    }

    is(msgCategory)
    {
        msgCategory = Message.parseCategory(msgCategory, true)
        if (msgCategory === null) {
            return false
        }
        if (msgCategory.msgType !== null && msgCategory.msgType !== this.msgType) {
            return false
        }
        if (msgCategory.topic !== null && msgCategory.topic !== this.topic) {
            return false
        }
        return true
    }

    static fromString(string)
    {
        try {
            data = JSON.prase(string)
        } catch (e) {
            return null
        }
    }

    toString()
    {
        const data = [this.msgType, this.topic]
        if (this.payload !== null) {
            data.push(this.payload)
        }
        return JSON.stringify(data)
    }

    static parseCategory(msgCategory, allowWildcards = false)
    {
        const parsed = msgCategory.split("@")
        if (parsed.length < 1 && parsed.length > 2) {
            console.error(`invalid message category: '${msgCategory}'`)
            return null
        }
        var topic = parsed[0]
        var msgType = (parsed.length == 2) ? parsed[1] : ''
        if (topic === '') {
            topic = null
        }
        if (msgType === '') {
            msgType = null
        }
        try {
            messageValidator.validate(
                [(msgType !== null) ? msgType : "query", (topic !== null) ? topic : "topic", null]
            )
        } catch (e) {
            console.error(`cannot parse message category: '${msgCategory}'`)
            return null
        }
        if (!allowWildcards && (msgType === null || topic === null)) {
            console.error(`message category must be strict: '${msgCategory}'`)
            return null
        }
        return {msgType, topic}
    }
}

export default Message
