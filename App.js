// Imports: Dependencies
import React from 'react';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';

// Imports: Screens
import Main from './screens/Main';

// Imports: Redux Persist Persister
import { store, persistor } from './redux/store/store';

// React Native: App
export default App = () => {
  return (
    // Redux: Global Store
    <Provider store={store}>
      <PersistGate 
        loading={null}
        persistor={persistor}
      >
        <Main />
      </PersistGate>
    </Provider>
  );
};