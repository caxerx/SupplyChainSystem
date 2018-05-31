<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Request Management</h1>
        <!-- Page title end -->

        <request-list></request-list>
    </v-container>
</template>

<script>
    import RequestList from "./RequestManagement/RequestList";
    export default {
        name: "RequestManagement",
        components: {RequestList}
    }
</script>

<style scoped>

</style>