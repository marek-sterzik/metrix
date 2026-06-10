/*
 * This module defines the relation (One to Many) between instruments and data sources. It provides the functionality
 * of sending data values from data source to multiple instruments and also the reverse way sending data values from
 * instrument to its data source.
 */

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

class DataSourceDispatcher
{
    constructor()
    {
        this.map = {}
        this.reverseMap = {}
    }

    registerInstrument(instrument, dataSource, topic)
    {
        const dataSourceInstance = getDataSource(dataSource)
        const instrumentId = objectId(instrument)

        this.map[instrumentId] = {dataSource: dataSourceInstance, topic}
        if (dataSourceInstance !== null) {
            const dataSourceId = objectId(dataSourceInstance)
            if (!(dataSourceId in this.reverseMap)) {
                this.reverseMap[dataSourceId] = {}
            }
            if (!(topic in this.reverseMap[dataSourceId])) {
                this.reverseMap[dataSourceId][topic] = {}
                this.initializeDataSourceProvider(dataSourceInstance, topic)
            }
            this.reverseMap[dataSourceId][topic][instrumentId] = instrument
        }
    }

    unregisterInstrument(instrument)
    {
        const instrumentId = objectId(instrument)
        if (instrumentId in this.map) {
            const dataSourceInstance = this.map[instruemntId].dataSource
            const topic = this.map[instrumentId].topic
            if (dataSourceInstance !== null) {
                const dataSourceId = objectId(dataSourceInstance)
                if ((dataSourceId in this.reverseMap) && (topic in this.reverseMap[dataSourceId]) && (instrumentId in this.reverseMap[dataSourceId][topic])) {
                    delete(this.reverseMap[dataSourceId][topic][instrumentId])
                    if (Object.keys(this.reverseMap[dataSourceId][topic]).length === 0) {
                        this.deinitializeDataSourceProvider(dataSourceInstance, topic)
                        delete(this.reverseMap[dataSourceId][topic])
                        if (Object.keys(this.reverseMap[dataSourceId]).length === 0) {
                            delete(this.reverseMap[dataSourceId])
                        }
                    }
                }
            }
            delete(this.map[instrumentId])
        }
    }

    initializeDataSourceProvider(dataSource, topic)
    {
        dataSource.startProvidingData(topic, (topic, value) => this.dispatchFromDataSource(dataSource, topic, value))
    }

    deinitializeDataSourceProvider(dataSource, topic)
    {
        dataSource.stopProvidingData(topic)
    }

    dispatchFromInstrument(instrument, value)
    {
        const instrumentId = objectId(instrument)
        if (instrumentId in this.map) {
            const dataSourceInstance = this.map[instrumentId].dataSource
            const topic = this.map[instrumentId].topic
            if (dataSourceInstance !== null) {
                try {
                    dataSourceInstance.send(topic, value)
                } catch (e) {
                }
            }
        }
    }

    dispatchFromDataSource(dataSource, topic, value)
    {
        const dataSourceId = objectId(dataSource)
        if ((dataSourceId in this.reverseMap) && (topic in this.reverseMap[dataSourceId])) {
            for (var instrumentId in this.reverseMap[dataSourceId][topic]) {
                this.reverseMap[dataSourceId][topic][instrumentId].setValue(value)
            }
        }
    }

}


export default new DataSourceDispatcher()
