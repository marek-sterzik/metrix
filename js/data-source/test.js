/*
 * This module sets up an easy random generating data source.
 */

import Message from "@metrix/message.js"

class TestDataSource
{
    constructor(uri, dispatcher)
    {
        this.uri = uri
        this.dispatcher = dispatcher
        this.topics = {}
        this.interval = setInterval(() => this.tick(), 1000)
    }

    send(message)
    {
        if (message.is("@query")) {
            this.topics[message.topic] = true
            this.dispatcher(new Message("broadcast", message.topic, this.generateValue()))
        }
    }

    tick()
    {
        for (var topic in this.topics) {
            this.dispatcher(new Message("broadcast", topic, this.generateValue()))
        }
    }

    generateValue()
    {
        return Math.random() * 100
    }
}

export default TestDataSource
