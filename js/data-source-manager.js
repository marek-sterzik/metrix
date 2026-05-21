/*
 * This module manages singleton instantiation of data source modules.
 */

import TestDataSource from "./data-source/test.js"

const dataSourceMap = {
    test: TestDataSource,
    ws: TestDataSource
}

const dataSources = {}

const getDataSource = (uri) => {
    if (!(uri in dataSources)) {
        try {
            const [proto, tmp] = uri.split(":", 2)
            if (!(proto in dataSourceMap)) {
                throw `proto ${proto} not registered`
            }
            const cls = dataSourceMap[proto]
            dataSources[uri] = new cls(uri)
        } catch (e) {
            console.error(`data source with uri '${uri}' cannot be created`, e)
            return null
        }
    }
    return dataSources[uri]
}

export default getDataSource
