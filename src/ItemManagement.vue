<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Item Management</h1>
        <!-- Page title end -->
        <router-view></router-view>
        <!--
        <item-list></item-list>
        <virtual-item-list></virtual-item-list>
        <category-list></category-list>
        -->

    </v-container>
</template>

<script>
    import ItemList from "./ItemManagement/SupplierItemList";
    import SupplierList from "./SupplierList";
    import VirtualItemList from "./ItemManagement/VirtualItemList";
    import CategoryList from "./ItemManagement/CategoryList";

    export default {
        name: "ItemManagement",
        components: {CategoryList, VirtualItemList, SupplierList, ItemList}
    }
</script>