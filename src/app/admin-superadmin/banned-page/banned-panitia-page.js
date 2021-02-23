import React, { Component } from 'react';
import { connect } from 'react-redux';
import { API } from '../../../common/api'
import { navigate } from '../../../common/store/action'
import { Button, Input, Icon, message, Modal } from 'antd'
import  * as Highlighter from 'react-highlight-words';
import BannedPanitiaComponent from '../../../modules/admin-superadmin/banned-page/banned-panitia-component';
//component
import {faTrashRestore  } from '@fortawesome/free-solid-svg-icons'
import ButtonEdit from '../../../common/component/button/button-edit';

const { confirm } = Modal;

class BannedPanitiaPage extends Component {
    state = {
        bannedPanitia : [],
        loading : false,
    }

    componentDidMount(){
        this.getBannedPanitia();
    }

    componentWillReceiveProps(props){
      if(props.activeKey !== this.props.activeKey){
        this.getBannedPanitia();
      }
    }

    getBannedPanitia=()=>{
      this.setState({loading: true})
      API.get(`/admin/trash/panitia`)
      .then(res => {
        this.setState({
          bannedPanitia:res.data.data.user,
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

     //function untuk modal
     showUnbannedConfirm = (id,nama_panitia) => {
      confirm({
          title: `Apakah yakin untuk mengaktifkan kembali akun panitia ${nama_panitia}?`,
          okText: 'Ok',
          okType: 'danger',
          cancelText: 'Batal',
          onOk: () => {
             this.UnbannedPanitia(id)
          },
          onCancel(){
          }
      });
    }


    UnbannedPanitia = (id_panitia, nama_panitia) => {   
      this.setState({loading:true})
      API.get(`/admin/unban/panitia/${id_panitia}`)
      .then(res => {
          if(res.status === 200){
              message.success(`Akun Panitia berhasil diaktifkan kembali`);
              this.componentDidMount(); 
          }   
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
                title: 'Nama Panitia',
                dataIndex: 'panitia',
                key: 'panitia',
                ...this.getColumnSearchProps('panitia'),
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              ...this.getColumnSearchProps('email'),
            },
            {
                title: 'Organisasi',
                dataIndex: 'organisasi',
                key: 'organisasi',
                ...this.getColumnSearchProps('organisasi'),
            },
            {
                title: 'No Telepon',
                dataIndex: 'no_telepon',
                key: 'no_telepon',
                ...this.getColumnSearchProps('no_telepon'),
            },
            {
                title: 'Action',
                key: 'action',
                render: (data) => (
                    [
                    <ButtonEdit
                      text="Kembalikan"
                      height={20}
                      icon={faTrashRestore}
                      borderRadius="5px"
                      background="#32852a"
                      onClick = { () => this.showUnbannedConfirm(data.id_panitia,data.panitia)}
                    />]
                ),
            },
        ];

        const data =  this.state.bannedPanitia.map( ({id_users, panitia,email}, index) => ({
          no : index+1,
          id_panitia : panitia.id_panitia,
          id_users : id_users,
          panitia : panitia.nama_panitia,
          email : email,
          organisasi : panitia.organisasi,
          no_telepon : panitia.telepon,
      }))

        return ( 
            <BannedPanitiaComponent
                initialData={this.state}
                navigate={this.props.navigate}
                columns={columns}
                data = {data}
            />
        );
    }
}
 
const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch => ({
    navigate,
}))();

const page = connect(mapStateToProps, mapDispatchToProps)(BannedPanitiaPage);
export default page