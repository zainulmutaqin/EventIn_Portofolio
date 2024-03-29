import React, { Component } from 'react';
import { Layout, Row, Col, Form,Modal,Checkbox  } from 'antd';
import '../../../assets/css/auth-login.css'
// component
import InputAuth from '../../../common/component/input/input-auth'
import ButtonAuth from '../../../common/component/button/button-auth'
import { Link } from 'react-router-dom';
import LoadingContainer from '../../../common/component/loading/loading-container'
import InputPassword from '../../../common/component/input/input-password';
const { Content } = Layout;
const logo = require(`../../../assets/images/logo.png`);
const login = require(`../../../assets/images/panitia.png`);

class RegisterComponent extends Component{
    render(){
        const { initialData, handleChange, handleSubmit,onRegister,handleOk,handleCancel,onChange } = this.props;
        return (
            <Layout className="login-container">
                 <LoadingContainer loading={initialData.loading}>
                    <Content style={{ overflow: "hidden",maxHeight:"100vh" }}>
                        <div style={{backgroundColor:"red"}}>
                            <Row>
                                <Col lg={15} md={12} sm={12} className="background-white container-full">                             
                                    <div className="login-section-container">
                                        <Link to="/">
                                            <img src={logo} alt="EventIn logo" width="100"/>
                                        </Link>
                                        <div className="auth-image-container mt-50 text-align-center float-ease" >
                                                <img
                                                    src={login}
                                                    alt="EventIn login"
                                                    style={{maxWidth: '65%'}}
                                                />
                                        </div>
                                    </div>
                                    <div className="text-soft-blue title-medium text-align-center bold">
                                      EventIn hadir untuk anda 
                                    </div>
                                    <div className="text-soft-black title-more-small text-align-center thin">
                                       Membantu mengelolah event anda.
                                    </div>                                
                                </Col>
                                <Col lg={9} md={12} sm={12} className="background-soft-blue container-full">
                                    <Row > 
                                        <Form >
                                            <div className="auth-register-form-container">
                                                <div className="text-white text-align-center title-more-small mb-20">
                                                    <p className="title-medium semi-bold m-0">Selamat Datang!</p>
                                                    <p className="form-description">Yuk, daftar sebagai panitia dan daftarkan eventmu di EventIn</p>
                                                </div>
                                                <span className="auth-input-label text-white">Nama Panitia</span>
                                                <InputAuth
                                                    name='nama_panitia'
                                                    placeholder="Masukkan nama panitia"
                                                    onChange={handleChange}
                                                    value={initialData.nama_panitia}
                                                    className="input-auth mt-5 mb-20"
                                                />
                                                <span className="auth-input-label text-white">Email</span>
                                                <InputAuth
                                                    name='email'
                                                    placeholder="Masukkan email"
                                                    onChange={handleChange}
                                                    value={initialData.email}
                                                    className="input-auth mt-5 mb-20"
                                                    iconType="mail"
                                                />
                                                <span className="auth-input-label text-white">Organisasi</span>
                                                <InputAuth
                                                    name='organisasi'
                                                    placeholder="Masukkan nama organisasi"
                                                    onChange={handleChange}
                                                    value={initialData.organisasi}
                                                    className="input-auth mt-5 mb-20"
                                                    iconType="user"
                                                />
                                                <span className="auth-input-label text-white">Kata Sandi</span>
                                                <InputPassword
                                                    name='password'
                                                    placeholder="Masukan kata sandi anda"
                                                    onChange={handleChange}
                                                    value={initialData.password}
                                                    className="input-auth mt-5 mb-20"
                                                    iconType="lock"
                                                    type="password"
                                                />
                                                <div>
                                                    <ButtonAuth
                                                        text="Daftar"
                                                        className="auth-button-red mt-40 auth-button-login"
                                                        style={{borderRadius: '26px',backgroundColor:'#FA607E',border:'none',color:'#ffff'}}
                                                        block={true}
                                                        onClick={onRegister}
                                                    />
                                                    <p className="auth-login-label mt-10 text-align-center text-white">Sudahkah memiliki akun? <Link to='/login' className="text-white"> Masuk sekarang. </Link></p>
                                                </div>
                                            </div>
                                        </Form>
                                    </Row>
                                    <Modal
                                        title="Syarat dan Ketentuan"
                                        visible={initialData.show}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        className = "modal-regis"
                                        >
                                        <p className="text-regis">
                                            1. Anda wajib memberikan nama lengkap dan jelas, 
                                            alamat email yang valid dan informasi lain yang dibutuhkan 
                                            dalam pendaftaran layanan EventIn
                                        </p>
                                        <p className="text-regis">
                                            2. Anda berkewajiban untuk menjaga kemanan password Anda, 
                                            EventIn tidak akan bertanggung jawab pada kerugian dan 
                                            kerusakan yang timbul akibat ketidak mampuan 
                                            Anda dalam menjaga keamanan password Anda.
                                        </p>
                                        <p className="text-regis">
                                            3. Anda tidak diijinkan menggunakan EventIn 
                                            untuk aktifitas ilegal dan melanggar hukum/undang-undang
                                            (termasuk undang-undang hak cipta) di wilayah Anda 
                                            dan/ataupun wilayah hukum Indonesia.
                                        </p>
                                        <p className="text-regis">
                                            4. Anda bertanggung jawab atas semua aktivitas 
                                            dan konten (data, text, foto, gambar, link) 
                                            yang Anda unggah melalui akun Anda di EventIn.
                                        </p>
                                        <p className="text-regis">
                                            5. Anda dilarang mengirimkan segalam macam worm, 
                                            virus, kode yang bersifat merusak.
                                        </p>
                                        <p className="text-regis">
                                            6. Pelanggaran akan ketentuan ini akan 
                                            mengakibatkan dihentikannya akun Anda.
                                        </p>
                                        <Checkbox onChange={onChange}>*Saya Menyetujui Syarat dan Ketentuan</Checkbox>
                                    </Modal>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                 </LoadingContainer>
            </Layout>
        );
    }
}


export default RegisterComponent;