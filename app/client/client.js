// this is the entry point

import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router'
import { history } from 'react-router/lib/BrowserHistory'
import getRootRoute from '../common/routes/rootRoute'
import AsyncProps from 'react-router/lib/experimental/AsyncProps'
import App from '../common/container/App'
import { INITIAL_DATA } from '../common/constants/initial'
import { APP_ID, DEBUG_ID } from '../common/constants/ids'
import StoresRegistry from '../common/util/StoresRegistry'
import { routerStateReducer } from 'redux-react-router'

document.addEventListener('DOMContentLoaded', function () {
  if (typeof history.setup === 'function') {
    history.setup()
  }

  const initialData = window[INITIAL_DATA]
  const storesRegistry = new StoresRegistry(
    { router: routerStateReducer },
    initialData
  )
  const store = storesRegistry.store
  const rootRoute = getRootRoute(store, {
    storesRegistry: storesRegistry
  })

  const clientOptions = {
    history,
    children: rootRoute,
    createElement: AsyncProps.createElement
  }
  Router.run(rootRoute, history.location, (error) => {
    if (error) return console.error(error)

    ReactDOM.render(
      <App client={clientOptions}/>,
      document.getElementById(APP_ID)
    )
    if (__DEV__ && __DEVTOOLS__) {
      const {
        DevTools,
        DebugPanel,
        LogMonitor
      } = require('redux-devtools/lib/react')
      ReactDOM.render(
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor}/>
        </DebugPanel>,
        document.getElementById(DEBUG_ID)
      )
    }
  })

  if (__DEV__) {
    window.store = store
    window.React = React
    window.ReactDOM = ReactDOM
    window.Router = Router
    window.history = history
  }
})
