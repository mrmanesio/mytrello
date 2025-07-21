import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.scss';
import Board from './components/Board';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Board />
      </div>
    </Provider>
  );
}

export default App;
