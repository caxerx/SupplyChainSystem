<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Item Management</h1>
        <!-- Page title end -->
        <item-list></item-list>

    </v-container>
</template>

<script>
    import ItemList from "./ItemManagement/ItemList";
    export default {
        name: "ItemManagement",
        components: {ItemList}
    }
</script>