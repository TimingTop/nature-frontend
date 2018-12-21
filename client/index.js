//console.log("Hey guys and ladies!")

import React from 'react';
import ReactDOM from 'react-dom';
import Buttom from '@material-ui/core/Button';
import App from './components/Input/index.jsx';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MyTheme from './src/assets/theme';

//ReactDOM.render(<App />, document.getElementById('root'));
const showRoot = (
    <MuiThemeProvider theme = {MyTheme}>

    </MuiThemeProvider>
)

ReactDOM.render(showRoot, document.getElementById('root'));
