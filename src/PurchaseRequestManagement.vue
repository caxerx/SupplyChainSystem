<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Request Management</h1>
        <!-- Page title end -->

        <purchase-request-list></purchase-request-list>
    </v-container>
</template>

<script>
    import PurchaseRequestList from "./RequestManagement/PurchaseRequestList";
    export default {
        name: "PurchaseRequestManagement",
        components: {PurchaseRequestList}
    }
</script>

<style scoped>

</style>