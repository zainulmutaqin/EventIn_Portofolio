import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from '../../common/store/action'
import { API } from '../../common/api'
import RegisteredEventComponent from '../../modules/list-event/component/registered-event-component';
import ButtonDashboard from '../../common/component/button/button-dashboard';
import { Tooltip,Button, Input, Icon } from 'antd';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import  * as Highlighter from 'react-highlight-words';
import CONSTANS from '../../common/utils/Constants'
import 'moment-timezone';
import 'moment/locale/id';
import moment from 'moment-timezone';

// import store.
import { setIdEvent } from '../../modules/admin-panitia/active-event/store/active-event-action'

class RegisteredEventPage extends Component {
    state = {
        loadingHome :false,
        registeredEvent : [],
    }

    componentDidMount(){
      this.getRegisteredEvent();
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Cari ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Cari
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Batal
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
    };
    
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    getRegisteredEvent = () => {
        this.setState({loadingHome: true})
        API.get(`/peserta/registered-event`)
        .then(res => {
            this.setState({
                registeredEvent:res.data.data.event,
                loadingHome: false,
            })
        });
    }
    onDetailEvent = (id) => {
      this.props.setIdEvent(id);
      this.props.navigate(CONSTANS.DETAIL_EVENT_KEY)
    }

    render() { 
        
        const columns = [
            {
                title: 'No',
                dataIndex: 'no',
                key: 'no',
                render: text => <a>{text}</a>,
                sorter: (a, b) => a.no - b.no,
                sortDirections: ['ascend','descend'],
            },
            {
                title: 'Nama Event',
                dataIndex: 'nama_event',
                key: 'nama_event',
                ...this.getColumnSearchProps('nama_event'),
            },
            {
                title: 'Panitia',
                dataIndex: 'nama_panitia',
                key: 'nama_panitia',
                ...this.getColumnSearchProps('nama_panitia'),
            },
            {
                title: 'Tempat',
                dataIndex: 'lokasi',
                key: 'lokasi',
                ...this.getColumnSearchProps('lokasi'),
            },
            {
                title: 'Tanggal Mulai',
                dataIndex: 'start_event',
                key: 'start_event',
                ...this.getColumnSearchProps('start_event'),
            },
            {
                title: 'Tanggal Selesai',
                dataIndex: 'end_event',
                key: 'end_event',
                ...this.getColumnSearchProps('end_event'),
              },
            {
              title: 'Action',
              key: 'action',
              render: (data) => (
                [
                <Tooltip title="Detail Event">
                    <ButtonDashboard
                        height={20}
                        icon={faInfoCircle}
                        borderRadius="5px"
                        background="#FFA903"
                        onClick={ () => this.onDetailEvent(data.id_event)}
                    />,
                </Tooltip>,
                ]
              ),
            },
        ];

        const data =  this.state.registeredEvent.map( ({id_peserta, id_event, event}, index) => ({
            no: index+1,
            id_peserta : id_peserta,
            id_event : id_event,
            nama_event : event.nama_event,
            lokasi : event.detail_event.lokasi,
            nama_panitia : event.panitia.nama_panitia,
            organisasi : event.organisasi,
            start_event :  moment(event.detail_event.start_event).format("DD MMMM YYYY"),
            end_event : moment(event.detail_event.end_event).format("DD MMMM YYYY"),
        }))

        return ( 
            <RegisteredEventComponent
                initialData={this.state}
                navigate={this.props.navigate}
                columns={columns}
                data={data}
            />
        );
    }
}
 
const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch => ({
    navigate,
    setIdEvent,
}))();

const page = connect(mapStateToProps, mapDispatchToProps)(RegisteredEventPage);
export default page