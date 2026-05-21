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

    startProvidingData(id, consummer)
    {
        this.sources[id] = setInterval(() => this.tick(id, consummer), 1000)
    }

    stopProvidingData(id)
    {
        clearInterval(this.sources[id])
        delete(this.sources[id])
    }

    send(id, value)
    {
    }

    tick(id, consummer)
    {
        const value = this.generateValueFor(id)
        consummer(id, value)
    }

    generateValueFor(id)
    {
        return Math.random() * 100
    }
}

export default TestDataSource
