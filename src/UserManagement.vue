<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">User Management</h1>
        <!-- Page title end -->

        <user-list></user-list>

    </v-container>
</template>

<script>
    import UserList from "./UserManagement/UserList";
    export default {
        name: 'UserManagement',
        components: {UserList}
    };
</script>
