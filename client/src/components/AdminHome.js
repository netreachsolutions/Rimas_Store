import React, { useState, useEffect } from 'react';
import AdminSideBar from './AdminSideBar';



const AdminHome = () => {
    return(
        <>
            {/* <nav
      className={`fixed top-0 navbar md:px-[40px] px-[20px] z-50 w-full h-[80px] flex items-center justify-between top-0 left-0`}
    > */}
          <AdminSideBar/>
        </>
    )
};

export default AdminHome;