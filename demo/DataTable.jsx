import * as React from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import { TableGrid as TableGridUI } from './../../components/Table'
import { tableGridSelect, tableGridClear, tableGridSort } from './../../actions/tableGrid';
import Pagination from '../../components/Pagination'
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import TimeButtonSelection from './TimeButtonSelection';


export default class DataTable extends React.Component {

    static propTypes = {
        tableGrid: PropTypes.object,
        hasCheckBox: PropTypes.bool,
        enableSelectAll: PropTypes.bool,
        uniqueKey: PropTypes.string,
        renderJson: PropTypes.object.isRequired,
        onRequestSort: PropTypes.func,
        onRowClick: PropTypes.func,
    }

    static defaultProps = {
        title: "table with time",
        pageSize: 5,
        currentPage: 0,
        totalSize: 0,
        renderJson: {
            dataSource: [
                {name: 'A', age: 20},
                {name: 'A', age: 20},
                {name: 'A', age: 20},
                {name: 'A', age: 20},
                {name: 'A', age: 20}
            ],
            columns:  [
                {text: 'Name', dataIndex: 'name'},
                {text: 'Age', dataIndex: 'age', sortable: true}
            ]
        },
        hasCheckBox: false,
        enableSelectAll: false,
        uniqueKey: '',
        tableGrid: {
            order: 'desc',
            orderBy: '',
            indexes: []
        }
    }

    constructor(props) {
        super(props);
        // this.state = JSON.parse(JSON.parse(this.props))
        // this.state = Object.assign({}, this.props, {hasCheckBox: false});
        // this.state = {...this.props, 
        //     hasCheckBox: false}
    }

    static getDerivedStateFromProps(props, state) {
        // when component init
        if (!state) {
            const data = props.data || {};
            const title = data.title || "";
            const columns = data.renderJson? data.renderJson.columns : [];
            const originData = data.renderJson? data.renderJson.dataSource :  [];
            
            const totalSize = originData? originData.length : 0;
            const pageNum = Math.ceil(totalSize / props.pageSize);
            const start = (props.currentPage) * props.pageSize;
            const showData = originData.slice(start, start + props.pageSize);

            let showRenderJson = {...data.renderJson, dataSource: showData};

            return {
                data: data,
                originData: originData,
                title: title,
                // renderJson: showRenderJson,
                // hasCheckBox: props.hasCheckBox,
                // enableSelectAll: props.enableSelectAll,
                uniqueKey: props.uniqueKey,
                tableGrid: props.tableGrid,
                pageSize: props.pageSize,
                currentPage: props.currentPage,
                totalSize: totalSize,
                pageNum: pageNum,
                columns: columns
            }
        } else if (!!props.data) {

            let {currentPage, pageSize} = state;
            const data = props.data;
            const title = data.title || "";
            const columns = data.renderJson? data.renderJson.columns : [];
            const originData = data.renderJson? data.renderJson.dataSource :  []; 

            const totalSize = originData? originData.length : 0;
            const pageNum = Math.ceil(totalSize / props.pageSize);
            let start = (props.currentPage) * props.pageSize;
            
            if (totalSize < start) {
                currentPage = 0;
                start = 0;
            }
            const showData = data.renderJson.dataSource.slice(start, start + pageSize);

            let showRenderJson = {...data.renderJson, dataSource: showData};

            return {
                data: data,
                originData: data.renderJson.dataSource,
                title: data.title,
                renderJson: showRenderJson,
                hasCheckBox: props.hasCheckBox,
                enableSelectAll: props.enableSelectAll,
                uniqueKey: props.uniqueKey,
                tableGrid: props.tableGrid,
                pageSize: pageSize,
                currentPage: currentPage,
                totalSize: totalSize,
                pageNum: pageNum,
                timer: data.timer,
                timerSelect: data.timerSelect
            }
        }
        return state;
    }

    componentDidMount() {
        const { timer } = this.state;
        const { timerClick } = this.props;
        if (!!timer && timer.length > 0 && !!timerClick && timerClick instanceof Function) {
            
        }
    }

    calcData(dataSource, pageSize, currentPage) {
        
        const totalSize = dataSource.length;
        const pageNum = Math.ceil(totalSize / pageSize);
        let start = (currentPage) * pageSize;
        if (totalSize < start) {
            currentPage = 0;
            start = 0;
        }
        const showData = dataSource.slice(start, start + pageSize);
        return {
            totalSize: totalSize,
            pageNum: pageNum,
            showData: showData,
            currentPage: currentPage
        }
    }


    renderPaginationBar = (total, currentPage, handlePageClick) => (
        <Pagination pageNum={Math.ceil(total / 10)}
          currentPage={currentPage}
          clickCallback={handlePageClick} />
    )

    handleOnRowClick = (property) => (event) => {
        console.info("on row click.");
    }

    handlePageClick = (event) => {
        const dataSource = this.props.data.renderJson.dataSource;
        let {totalSize, pageNum, showData, currentPage} = this.calcData(dataSource, this.state.pageSize, event.selected);

        let showRenderJson = {...this.state.data.renderJson, dataSource: showData};
        this.setState({
            pageNum: pageNum,
            renderJson: showRenderJson,
            currentPage: currentPage
        });
        // console.info(event);
    }

    requestSort = (property) => (event) => {
        let { tableGrid, originData, pageSize, currentPage, renderJson } = this.state
        const orderBy = property
        let order= 'desc'
        if (tableGrid.orderBy === property && tableGrid.order === 'desc') {
            order = 'asc'
        }
        const propertySort = order === 'desc'?R.descend(R.prop(orderBy)):R.ascend(R.prop(orderBy));
        const propertySortWith = R.sortWith([propertySort]);
        const sortOriginData = propertySortWith(originData);

        let {totalSize, pageNum, showData} = this.calcData(sortOriginData, pageSize, currentPage);
        let showRenderJson = {...renderJson, dataSource: showData}
        let showTableGrid = {...tableGrid, order: order, orderBy: orderBy}

        this.setState({
           originData: sortOriginData,
           totalSize: totalSize,
           pageNum: pageNum,
           renderJson: showRenderJson,
           tableGrid: showTableGrid
        });
        
    }

    // adapterData() {
    //     // controller parm
    //     const {currentPage, pageSize} = this.state;
    //     // data
    //     const {data} = this.props;
    //     let title = data.title || "";
    //     let renderJson = data.renderJson || {};
    //     let {totalSize, pageNum, showData, currentPage} = this.calcData(renderJson.dataSource, pageSize, currentPage);

    //     return {
    //         title: title,
    //         totalSize: totalSize,
    //         pageNum: pageNum,
    //         showData: showData,
    //         currentPage: currentPage
    //     }
    // }

    render() {
        const {title, renderJson, hasCheckBox, tableGrid, pageSize, 
            currentPage, totalSize, pageNum, uniqueKey, timer, timerSelect} = this.state;
        let {order = 'desc', orderBy = 'none'} = tableGrid
        const  renderJsonShow = {...renderJson, order: order, orderBy: orderBy};
        
        return (
            <Grid container spacing={0}>
                <Grid item xs={12} container direction="row">
                    <Grid item xs>
                        <Typography>{title}</Typography>
                    </Grid>
                    {
                        this.props.showTimer?
                        <Grid item xs justify="flex-end" >
                            <TimeButtonSelection refreshTime={this.props.refreshTime} onClick={this.props.timerClick}></TimeButtonSelection>
                        </Grid>
                        : ''
                    }
                    
                </Grid>
                <Grid item xs={12}>
                    <TableGridUI 
                        renderJson={renderJsonShow}
                        hasCheckBox={hasCheckBox}
                        indexes={tableGrid.indexes}
                        uniqueKey={uniqueKey}
                        order={order}
                        onRequestSort={this.requestSort}
                        onRowClick={this.handleOnRowClick}
                        orderBy={orderBy}/>
                </Grid>
                <Grid item xs={12}>
                    <Pagination pageNum={pageNum}
                        currentPage={currentPage}
                        clickCallback={this.handlePageClick} />
                </Grid>
            </Grid>
            
        )
    }
}



//
data: {
                title: "Device Counters",
                renderJson: {
                    dataSource: [{A:1, B:2}],
                    columns: [{text: 'AAAA', dataIndex: 'A'}]
                }
            }

