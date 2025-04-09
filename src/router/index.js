import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import SensorShow from '@/views/SensorShow.vue';
import Organization from '../views/Organization.vue';
import Login from '../views/Login.vue';
import LoginLayout from '../views/LoginLayout.vue';
import Admin from '../views/Admin.vue';
import OrganizationFormPage from '../views/OrganizationFormPage.vue';
import OrganizationEdit from '../views/OrganizationEdit.vue';
import UserFormPage from '../views/UserFormPage.vue';
import UserEdit from '../views/UserEdit.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

// Arrow function for jwtDecode
const jwtDecode = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Arrow function for checkAdmin
const checkAdmin = (to, from, next) => {
  let token = localStorage.getItem('jwtToken');
  if (token) {
    if (jwtDecode(token).role === 'admin') {
      next();
    } else {
      next('/home');
    }
  } else {
    next('/');
  }
};

const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: checkAdmin,
    children: [
      {
        path: 'organizations',
        component: () => import('@/views/OrganizationList.vue'),
      },
      { path: 'organizations/new', component: OrganizationFormPage },
      {
        path: '/admin/organizations/:id/edit',
        name: 'organization.edit',
        component: OrganizationEdit,
        props: true,
      },
      { path: 'users', component: () => import('@/views/UserList.vue') },
      { path: 'users/new', component: UserFormPage },
      {
        path: '/admin/users/:id/edit',
        name: 'user.edit',
        component: UserEdit,
        props: true,
      },
      { path: 'sensors', component: () => import('@/views/SensorView.vue') },
    ],
  },
  {
    path: '/home', //THIS IS FOR USERS
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    // name: 'LoginLayout',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'LoginPage',
        component: Login,
      },
    ],
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
  },
  {
    path: '/organization',
    name: 'Organization',
    component: Organization,
  },
  {
    path: '/organization/:id',
    name: 'organization.show',
    component: () => import('@/views/OrganizationShow.vue'),
    props: true,
    // props: true,
    // props: (route) => ({
    //     id: route.params.id,
    //     name: route.params.name, // Pass the name from params
    // }),
    // children: [
    //     {
    //         path: 'sensor/:sensorId',
    //         name: 'sensor.show',
    //         component: () => import('@/views/SensorShow.vue'),
    //         props: true
    //     }]
  },
  {
    path: '/organization/:id/sensor/:sensorId',
    name: 'sensor.show',
    component: () => import('@/views/SensorShow.vue'),
    // props: (route) => ({
    //     organizationId: route.params.id,
    //     sensorId: route.params.sensorId,
    //     sensorName: route.query.name // Pass the sensor name from the query
    // })
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // linkActiveClass: 'vue-school-active-link',
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwtToken');

  // Check if token is not present and the user is trying to access a protected route
  // if (!token && to.path !== '/') {
  if (
    !token &&
    to.path !== '/' &&
    to.path !== '/forgot-password' &&
    to.path !== '/reset-password'
  ) {
    // Redirect to homepage if not logged in
    next('/'); // You can change this to '/login' if you have a separate login page
  } else {
    next(); // Allow the navigation
  }
});

export default router;
