<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Agreement Management</h1>
        <!-- Page title end -->

        <agreement-list></agreement-list>

    </v-container>
</template>

<script>
    import AgreementList from "./AgreementManagement/AgreementList";
    export default {
        name: "AgreementManagement",
        components: {AgreementList}
    }
</script>

<style scoped>

</style>