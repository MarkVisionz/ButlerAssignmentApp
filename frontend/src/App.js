import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import 'antd/dist/reset.css';

const App = () => {
    return (
        <Provider store={store}>
            <Navbar />
        </Provider>
    );
};

export default App;
