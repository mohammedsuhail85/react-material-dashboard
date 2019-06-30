import React from 'react';
import ReactDOM from 'react-dom';

// App
import App from './App';

// Service worker
import * as serviceWorker from './common/serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
