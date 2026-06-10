/*
 * This module defines the relation (One to Many) between instruments and data sources. It provides the functionality
 * of sending data values from data source to multiple instruments and also the reverse way sending data values from
 * instrument to its data source.
 */

import Message from "@metrix/message.js"
import getDataSource from "./data-source-manager.js"

const objectIdMap = new WeakMap()
var lastObjectId = 0

const objectId = (object) => {
    var id = objectIdMap.get(object)
    if (id !== undefined) {
        return id
    }
    id = "i" + (++lastObjectId)
    objectIdMap.set(object, id)
    return id
}

class MessageDispatcher
{
    constructor()
    {
        this.cats = {}
        this.instruments = {}
    }

    dispatchMessage(message)
    {
        const msgType = message.msgType
        const topic = message.topic

        if ((msgType in this.cats) && (topic in this.cats[msgType])) {
            for (var record of this.cats[msgType][topic]) {
                const consumer = record.consumer
                try {
                    consumer(message)
                } catch (e) {
                }
            }
        }
    }

    registerConsumer(instrumentId, msgCategory, consumer)
    {
        msgCategory = Message.parseCategory(msgCategory)
        if (msgCategory !== null) {
            const msgType = msgCategory.msgType
            const topic = msgCategory.topic
            const record = {msgType, topic, consumer, instrumentId}
            if (!(msgType in this.cats)) {
                this.cats[msgType] = {}
            }
            if (!(topic in this.cats[msgType])) {
                this.cats[msgType][topic] = []
            }
            const index = this.cats[msgType][topic].length
            record.index = index
            Object.freeze(record)
            this.cats[msgType][topic].push(record)
            
            if (!(instrumentId in this.instruments)) {
                this.instruments[instrumentId] = []
            }
            this.instruments[instrumentId].push(record)
            return record
        }
        return null
    }

    unregisterConsumer(record)
    {
        if (record !== null) {
            const instrumentId = record.instrumentId
            if (instruemntId in this.instruments) {
                const index = this.instruments[instrumentId].indexOf(record);
                if (index > -1) {
                    this.instruments[instrumentId].splice(index, 1);
                    if (this.instruments[instrumentId].length == 0) {
                        delete this.instruments[instrumentId]
                    }
                }
            }

            const msgType = record.msgType
            const topic = record.topic
            const recordIndex = record.index
            if ((msgType in this.cats) && (topic in this.cats[msgType])) {
                this.cats[msgType][topic].splice(recordIndex, 1)
                if (this.cats[msgType][topic].length == 0) {
                    delete this.cats[msgType][topic]
                }
                if (Object.keys(this.cats[msgType]).length == 0) {
                    delete this.cats[msgType]
                }
            }
        }
    }

    unregisterInstrument(instrumentId)
    {
        if (instrumentId in this.instruments) {
            const records = [...this.instruments[instrumentId]]
            for (var record of records) {
                this.unregisterConsumer(record)
            }
        }
    }

    isEmpty()
    {
        return Object.keys(this.cats).length == 0
    }
}


class DataSourceDispatcher
{
    constructor()
    {
        this.map = {}
        this.dispatchers = {}
    }

    registerInstrument(instrument, dataSource, topic)
    {
        const dataSourceInstance = getDataSource(dataSource)
        const instrumentId = objectId(instrument)
        const dataSourceId = objectId(dataSourceInstance)

        this.map[instrumentId] = dataSourceInstance

        if (topic !== null && topic !== undefined) {
            this.registerInstrumentConsumer(
                instrument,
                topic + "@broadcast",
                message => instrument.setValue(message.payload)
            )
            this.dispatchFromInstrument(instrument, new Message("query", topic, null))
        }
    }

    registerInstrumentConsumer(instrument, msgCategory, consumer)
    {
        const instrumentId = objectId(instrument)
        const dataSourceId = objectId(this.map[instrumentId])
        if (!(dataSourceId in this.dispatchers)) {
            this.dispatchers[dataSourceId] = new MessageDispatcher()
        }
        return this.dispatchers[dataSourceId].registerConsumer(instrumentId, msgCategory, consumer)
    }
    
    unregisterInstrumentConsumer(instrument, handle)
    {
        const instrumentId = objectId(instrument)
        const dataSourceId = objectId(this.map[instrumentId])
        if (dataSourceId in this.dispatchers) {
            this.dispatchers[dataSourceId].unregisterConsumer(handle)
            if (this.dispatchers[dataSourceId].isEmpty()) {
                delete this.dispatchers[dataSourceId]
            }
        }
    }

    unregisterInstrument(instrument)
    {
        const instrumentId = objectId(instrument)
        const dataSourceId = objectId(this.map[instrumentId])
        if (dataSourceId in this.dispatchers) {
            this.dispatchers[dataSourceId].unregisterInstrument(instrumentId)
            if (this.dispatchers[dataSourceId].isEmpty()) {
                delete this.dispatchers[dataSourceId]
            }
        }
        delete this.map[instrumentId]
    }

    initializeDataSourceProvider(dataSource, topic)
    {
        dataSource.startProvidingData(topic, (topic, value) => this.dispatchFromDataSource(dataSource, topic, value))
    }

    deinitializeDataSourceProvider(dataSource, topic)
    {
        dataSource.stopProvidingData(topic)
    }

    dispatchFromInstrument(instrument, message)
    {
        const instrumentId = objectId(instrument)
        this.map[instrumentId].send(message)
    }

    dispatchFromDataSource(dataSource, message)
    {
        const dataSourceId = objectId(dataSource)
        if (dataSourceId in this.dispatchers) {
            this.dispatchers[dataSourceId].dispatchMessage(message)
        }
    }

}


export default new DataSourceDispatcher()
