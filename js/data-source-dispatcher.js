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

    registerInstrument(instrument, dataSource, id)
    {
        const dataSourceInstance = getDataSource(dataSource)
        const instrumentId = objectId(instrument)

        this.map[instrumentId] = {dataSource: dataSourceInstance, id}
        if (dataSourceInstance !== null) {
            const dataSourceId = objectId(dataSourceInstance)
            if (!(dataSourceId in this.reverseMap)) {
                this.reverseMap[dataSourceId] = {}
            }
            if (!(id in this.reverseMap[dataSourceId])) {
                this.reverseMap[dataSourceId][id] = {}
                this.initializeDataSourceProvider(dataSourceInstance, id)
            }
            this.reverseMap[dataSourceId][id][instrumentId] = instrument
        }
    }

    unregisterInstrument(instrument)
    {
        const instrumentId = objectId(instrument)
        if (instrumentId in this.map) {
            const dataSourceInstance = this.map[instruemntId].dataSource
            const id = this.map[instrumentId].id
            if (dataSourceInstance !== null) {
                const dataSourceId = objectId(dataSourceInstance)
                if ((dataSourceId in this.reverseMap) && (id in this.reverseMap[dataSourceId]) && (instrumentId in this.reverseMap[dataSourceId][id])) {
                    delete(this.reverseMap[dataSourceId][id][instrumentId])
                    if (Object.keys(this.reverseMap[dataSourceId][id]).length === 0) {
                        this.deinitializeDataSourceProvider(dataSourceInstance, id)
                        delete(this.reverseMap[dataSourceId][id])
                        if (Object.keys(this.reverseMap[dataSourceId]).length === 0) {
                            delete(this.reverseMap[dataSourceId])
                        }
                    }
                }
            }
            delete(this.map[instrumentId])
        }
    }

    initializeDataSourceProvider(dataSource, id)
    {
        dataSource.startProvidingData(id, (id, value) => this.dispatchFromDataSource(dataSource, id, value))
    }

    deinitializeDataSourceProvider(dataSource, id)
    {
        dataSource.stopProvidingData(id)
    }

    dispatchFromInstrument(instrument, value)
    {
        const instrumentId = objectId(instrument)
        if (instrumentId in this.map) {
            const dataSourceInstance = this.map[instrumentId].dataSource
            const id = this.map[instrumentId].id
            if (dataSourceInstance !== null) {
                try {
                    dataSourceInstance.send(id, value)
                } catch (e) {
                }
            }
        }
    }

    dispatchFromDataSource(dataSource, id, value)
    {
        const dataSourceId = objectId(dataSource)
        if ((dataSourceId in this.reverseMap) && (id in this.reverseMap[dataSourceId])) {
            for (var instrumentId in this.reverseMap[dataSourceId][id]) {
                this.reverseMap[dataSourceId][id][instrumentId].setValue(value)
            }
        }
    }

}


export default new DataSourceDispatcher()
