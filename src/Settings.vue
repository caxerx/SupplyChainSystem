<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text">Settings</h1>
        <!-- Page title end -->

        <v-switch label="Developer Mode" v-model="dev"></v-switch>
    </v-container>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                dev: true
            }
        }
    }
</script>