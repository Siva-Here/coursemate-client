import React from 'react'

const AdminNav = () => {
    function handleLogOut(){
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        window.location.href = '/login';
        window.alert('Log Out Successful');
    }
    return (
        <div className='mb-5 navbar-light text-dark'>
            <nav class="navbar navbar-expand-lg navbar-dark fs-4">
                <div class="container-fluid">
                    <h2 class="display-6 fs-2 fw-bold text-white m-2" href="#">{localStorage.getItem('username')}</h2>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto me-5 mb-2 mb-lg-0 text-end">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Contact</a>
                            </li>
                            <li class="nav-item">
                                <a onClick={handleLogOut} class="nav-link active" href="#">LogOut</a>
                            </li>
                        </ul>
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default AdminNav;