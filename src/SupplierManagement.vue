<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Supplier Management</h1>
        <!-- Page title end -->
        <supplier-list></supplier-list>

    </v-container>
</template>

<script>
    import SupplierList from "./SupplierList";

    export default {
        name: "SupplierManagement",
        components: {SupplierList}
    }
</script>

<style scoped>

</style>