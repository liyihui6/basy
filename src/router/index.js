import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index'

Vue.use(Router);

const router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            component: Index
        }
    ]
});

export default router;