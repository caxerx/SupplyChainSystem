<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Settings</h1>
        <!-- Page title end -->

        <v-switch label="Developer Mode" v-model="$store.state.devMode"
                  v-if="$store.state.userType==='999'"></v-switch>
    </v-container>
</template>

<script>
    export default {
        name: "Settings"
    }
</script>