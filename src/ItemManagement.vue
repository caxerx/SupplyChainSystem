<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text">Item Management</h1>
        <!-- Page title end -->

        <!-- Breadcrumbs start -->
        <div>
            <v-breadcrumbs divider="/">
                <v-breadcrumbs-item v-for="item in $store.state.breadcrumbs" :key="item.text" :disabled="item.disabled">
                    {{ item.text }}
                </v-breadcrumbs-item>
            </v-breadcrumbs>
        </div>
        <!-- Breadcrumbs end -->
    </v-container>
</template>

<script>
    export default {
        name: "ItemManagement"
    }
</script>

<style scoped>

</style>