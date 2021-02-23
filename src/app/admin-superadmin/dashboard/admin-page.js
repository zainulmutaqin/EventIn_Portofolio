import React, { Component } from 'react';
import { connect } from 'react-redux';
import { API } from '../../../common/api'
import { navigate } from '../../../common/store/action'
import AdminComponent from '../../../modules/admin-superadmin/dashboard/admin-component';

import 'moment-timezone';
import 'moment/locale/id';
import moment from 'moment-timezone';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

class AdminPage extends Component {
    state = {  
        total_peserta: '',
        total_panitia: '',
        total_penandatangan: '',
        total_sertifikat : '',
        total_event :'',
        loading: false,
        loadingEvent : false,
        year_range : '',
        year : moment().years(),
        yearOptions: [],
    }

    componentDidMount () {
        this.getEventbyMonth(this.state.year);
        this.getUserbyRole();
        this.getAllSertifikat();
        this.getAllEvent();
        this.getAllUser();
        this.getYear();
    }

    getEventbyMonth = (year) => {
        this.setState({loadingEvent: true})
        API.get(`/admin/count-event/${year}`)
        .then(res => {
            this.setState({loadingEvent:false})
            this.barChart(res.data)
        });
    }
    getYear=()=>{
        API.get(`/admin/year-range`)
            .then(res => {
            let yearOptions = [];
            let minYears = moment(res.data.data.event.start_event).years();
            let maxYears = moment().years();
            for(;minYears<=maxYears;minYears++){
                yearOptions.push(minYears)
            }
            this.setState({
                year_range:moment(res.data.data.event.start_event).years(),
                loading: false,
                yearOptions,
            })
        });
    }

    getUserbyRole = () => {
        this.setState({loading: true})
        API.get(`/admin/count-user`)
        .then(res => {
            this.setState({loading:false})
            this.pieChart(res.data)
        });
    }
    getAllSertifikat = () => {
        this.setState({loading: true})
        API.get(`/admin/count-all-sertifikat`)
        .then(res => {
            this.setState({total_certificate : res.data.data.sertifikat,loading : false})
        });
    }

    getAllEvent = () => {
        this.setState({loading: true})
        API.get(`/admin/count-all-event`)
        .then(res => {
            this.setState({total_event : res.data.data.event,loading : false})
        });
    }

    getAllUser = () => {
        this.setState({loading: true})
        API.get(`/admin/count-all-user`)
        .then(res => {
            this.setState({total_user : res.data.data.user,loading : false})
        });
    }

    pieChart = (data_users) => {
        let chart = am4core.create("chartpiediv", am4charts.PieChart);
        let data_user = [];
        for(let i=0; i<data_users.size; i++){
            data_user.push({
                user: data_users.data.user[i],
                total : data_users.data.data[i]
            })
        }
        chart.data = data_user;
        
        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
        chart.legend = new am4charts.Legend();
        chart.legend.maxWidth = undefined;
        chart.legend.position = "absolute";
        chart.legend.valueLabels.template.align = "right"
        chart.legend.valueLabels.template.textAlign = "end"
        pieSeries.dataFields.value = "total";
        pieSeries.dataFields.category = "user";
    }
    
    barChart = (data_event_ac) => {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();
        chart.legend = new am4charts.Legend();
        let data_event = [];
       
        for(let i=0; i<data_event_ac.size; i++){
            data_event.push({
                bulan: data_event_ac.data.bulan[i],
                jumlah : data_event_ac.data.data[i]
            })
        }

        chart.data = data_event;
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "bulan";
        categoryAxis.title.text = "Bulan";

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Jumlah";

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "jumlah";
        series.dataFields.categoryX = "bulan";
        series.name = "Jumlah";
        series.columns.template.tooltipText = "Bulan: {categoryX}\nTotal: {valueY}";
        series.columns.template.fill = am4core.color("#104547"); // fill
    }


  
    handleYear = (input, option) => {
        this.setState({ year: input })  
        this.getEventbyMonth(input)
    }

    render() { 
        return ( 
            <AdminComponent
                navigate={this.props.navigate}
                initialData = {this.state}
                handleYear = {this.handleYear}
            />
        );
    }
}
 
const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch => ({
    navigate,
}))();

const page = connect(mapStateToProps, mapDispatchToProps)(AdminPage);
export default page