import { createMuiTheme } from '@material-ui/core/styles';
import { pink, indigo } from '@material-ui/core/colors';

let customTheme = config => Object.assign({
    palette: {
        primary: pink,
        secondary: indigo
    },
    spacing: {

    },
    fontFamily: 'aaa'
    
}, config || {});

let componentTheme = {
    tableRow: {
        padding: 20
    }
}

export default createMuiTheme(Object.assign(
    createMuiTheme(customTheme),
    componentTheme
))