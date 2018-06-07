<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Request Management(Full)</h1>
        <!-- Page title end -->

        <full-request-list></full-request-list>
    </v-container>
</template>

<script>
    import FullRequestList from "./RequestManagement/FullRequestList";
    export default {
        name: "FullRequestManagement",
        components: {FullRequestList}
    }
</script>

<style scoped>

</style>