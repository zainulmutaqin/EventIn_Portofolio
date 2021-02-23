import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, message, Button, Input, Icon, Divider, Tooltip} from 'antd'
import CONSTANS from '../../../common/utils/Constants'
import { API } from '../../../common/api'
import  * as Highlighter from 'react-highlight-words';
import { faCheckCircle, faTrash, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../../common/store/action'
import BiodataPenandatanganAdminComponent from '../../../modules/admin-superadmin/user/penandatangan/biodata-penandatangan-component';
import ButtonDashboard from '../../../common/component/button/button-dashboard';

const {confirm} = Modal;

class BiodataPenandatanganAdminPage extends Component {
    state = { 
        penandatangan: [],
        loading : false,
        show : false,
    }

    componentDidMount(){
         this.getBiodata();
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

    //get data dari API
    getBiodata=()=>{
        this.setState({loading: true})
        API.get(`/admin/showbiodatapenandatangan`)
        .then(res => {
            this.setState({
                penandatangan:res.data.data.biodata,
                loading: false,
            })
        });
    }

    //function untuk modal
    showAddConfirm = (id,nama,jabatan,instansi) => {
        confirm({
            title: `Yakin untuk menerima ${nama}, ${jabatan} dari ${instansi} sebagai penandatangan ? `,
            okText: 'Ok',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: () => {
                this.addPenandatangan(id)
            },
            onCancel(){
            }
        });
    }

     //function untuk modal.
     showRejectConfirm = (id,nama,jabatan,instansi) => {
      confirm({
          title: `Yakin untuk menolak ${nama}, ${jabatan} dari ${instansi} sebagai penandatangan ?`,
          okText: 'Ok',
          okType: 'danger',
          cancelText: 'Batal',
          onOk: () => {
              this.rejectPenandatangan(id)
          },
          onCancel(){
           
          }
      });
  }

    //add penandatangan
    addPenandatangan = (id) => {
        const params = {
            id_biodata_penandatangan: id,  
        }
        this.setState({loading: true})
        this.showModal2();
        API.post(`/admin/addpenandatangan`,params)
        .then(res => {
            if(res.status === 200){
                message.success('Berhasil menambahkan penandatangan');
                this.props.navigate(CONSTANS.BIODATA_PENANDATANGAN_ADMIN_KEY)
            }  
            this.setState({loading: false}) 
        });
    }

    //add penandatangan.
    rejectPenandatangan = (id) => {
      const params = {
          id_biodata_penandatangan: id,  
      }
      this.setState({loading: true})
      this.showModal2();
      API.post(`/admin/reject-penandatangan`,params)
      .then(res => {
          if(res.status === 200){
              message.success('Berhasil menolak penandatangan');
              this.props.navigate(CONSTANS.BIODATA_PENANDATANGAN_ADMIN_KEY)
          }  
          this.setState({loading: false}) 
      });
    }

    showModal2 = () => {
      this.setState({
          show :true,
      })
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
                title: 'Nama',
                dataIndex: 'nama',
                key: 'nama',
                ...this.getColumnSearchProps('nama'),
            },
            {
                title: 'Instansi',
                dataIndex: 'instansi',
                key: 'instansi',
                ...this.getColumnSearchProps('instansi'),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: 'Jabatan',
                dataIndex: 'jabatan',
                key: 'jabatan',
                ...this.getColumnSearchProps('jabatan'),
            },
            {
                title: 'Telepon',
                dataIndex: 'telepon',
                key: 'telepon',
                ...this.getColumnSearchProps('telepon'),
            },
            {
              title: 'Action',
              key: 'action',
              render: (data) => (
                [
                <Tooltip title="Terima">
                  <item>
                    
                  </item>
                  <ButtonDashboard
                      height={20}
                      icon={faCheckCircle}
                      borderRadius="5px"
                      background="#32852a"
                      onClick = { () => this.showAddConfirm(data.id_biodata_penandatangan,data.nama,data.jabatan,data.instansi)}
                  />
                </Tooltip>,
                <Divider type="vertical"/>,
                <Tooltip title="Tolak">
                  <item>
                  <ButtonDashboard
                      height={20}
                      icon={faWindowClose}
                      borderRadius="5px"
                      background="#FF0303"
                      onClick= {()=> this.showRejectConfirm(data.id_biodata_penandatangan,data.nama,data.jabatan,data.instansi)}
                  />
                  </item>
                </Tooltip>
                ]
              ),
            },
        ];
        
        const data =  this.state.penandatangan.map( ({id_biodata_penandatangan, nama, instansi, jabatan,email,telepon}, index) => ({
            no : index+1,
            id_biodata_penandatangan : id_biodata_penandatangan,
            nama: nama,
            email : email,
            instansi : instansi,
            jabatan : jabatan,
            telepon : telepon,
        }))
    
    
        return ( 
            <BiodataPenandatanganAdminComponent
                navigate={this.props.navigate}
                initialData={this.state}
                data={data}
                columns={columns}
            />
        );
    }
}
 
const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch => ({
    navigate,
}))();

const page = connect(mapStateToProps, mapDispatchToProps)(BiodataPenandatanganAdminPage);
export default page