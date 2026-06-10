/*
 * This module sets up an easy random generating data source.
 */

class TestDataSource
{
    constructor(uri)
    {
        this.uri = uri
        this.sources = {}
    }

    startProvidingData(topic, consummer)
    {
        this.sources[topic] = setInterval(() => this.tick(topic, consummer), 1000)
    }

    stopProvidingData(topic)
    {
        clearInterval(this.sources[topic])
        delete(this.sources[topic])
    }

    send(topic, value)
    {
    }

    tick(topic, consummer)
    {
        const value = this.generateValueFor(topic)
        consummer(topic, value)
    }

    generateValueFor(topic)
    {
        return Math.random() * 100
    }
}

export default TestDataSource
