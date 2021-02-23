import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip, Button, Input, Icon } from 'antd';
import { faInfoCircle, } from '@fortawesome/free-solid-svg-icons'
import  * as Highlighter from 'react-highlight-words'
import { API } from '../../../common/api'
import { navigate } from '../../../common/store/action'
import ListWaitingCertificateComponent from '../../../modules/admin-panitia/e-certificate/list-waiting-certificate-component';
import ButtonDashboard from '../../../common/component/button/button-dashboard';
// import store
import { setIdSertifikat } from '../../../modules/admin-panitia/e-certificate/store/e-certificate-action'

class ListWaitingCertificatePage extends Component {
    state = {  
        certificate: [],
        url: '',
        visible : false,
        loading: false,
    }

    componentDidMount(){
        this.getListCertificateWaiting(this.props.idEvent);
    }

    getListCertificateWaiting=(id_event)=>{
        this.setState({loading: true})
        API.get(`/panitia/event-received-sertifikat/${id_event}`)
        .then(res => {
          this.setState({
              certificate:res.data.data.sertifikat,
              loading: false,
            })
        });
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
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
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
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

    handleOk = e => {
        this.setState({
          visible: false,
        });
    };
    
    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

    //button detail certificate
    onDetailCertificate = (sertif_URL) => {
        this.setState({
          visible: true,
          url : sertif_URL,
        });
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
            title: 'Nama Penandatangan',
            dataIndex: 'nama_penandatangan',
            key: 'nama_penandatangan',
            ...this.getColumnSearchProps('nama_penandatangan'),
        },
        {
            title: 'Instansi',
            dataIndex: 'instansi',
            key: 'instansi',
            ...this.getColumnSearchProps('instansi'),
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            ...this.getColumnSearchProps('jabatan'),
        },
        {
            title: 'File',
            dataIndex: 'nama_sertifikat',
            key: 'nama_sertifikat',
            ...this.getColumnSearchProps('nama_sertifikat'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (data) => (
            [
            <Tooltip title="Detail">
            <ButtonDashboard
                height={20}
                icon={faInfoCircle}
                borderRadius="5px"
                background="#FFA903"
                onClick = {() => this.onDetailCertificate(data.sertifikat_URL)}
            />
            </Tooltip>]
            ),
        },
    ];
    
    const data =  this.state.certificate.map( ({id_penandatangan_sertifikat, id_sertifikat, sertifikat_URL, sertifikat,penandatangan,nama_sertifikat}, index) => ({
        no : index+1,
        id_sertifikat:id_sertifikat,
        id_penandatangan_sertifikat : id_penandatangan_sertifikat,
        nama_event : sertifikat.event.nama_event,
        nama_penandatangan : penandatangan.nama_penandatangan,
        instansi : penandatangan.instansi,
        jabatan : penandatangan.jabatan,
        sertifikat : sertifikat.sertifikat,
        nama_sertifikat : nama_sertifikat,
        sertifikat_URL : sertifikat_URL,
    }))
    
        return ( 
            <ListWaitingCertificateComponent
                navigate={this.props.navigate}
                initialData={this.state}
                columns={columns}
                data={data}
                handleCancel= {this.handleCancel}
                handleOk = {this.handleOk}
            />
        );
    }
}
 
const mapStateToProps = state => ({
    ...state.activeEvent,
});

const mapDispatchToProps = (dispatch => ({
    navigate,
}))();

const page = connect(mapStateToProps, mapDispatchToProps)(ListWaitingCertificatePage);
export default page