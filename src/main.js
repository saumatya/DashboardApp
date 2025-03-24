import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import router from './router'
import './style.css'
import App from './App.vue'
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';

const app= createApp(App);

app.component('Button', Button);
app.component('DatePicker', DatePicker);
app
.use(router)
.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
.mount('#app')

