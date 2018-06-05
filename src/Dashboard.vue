<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Dashboard</h1>
        <!-- Page title end -->
        <v-layout row>
            <v-flex xs8 class="pa-1">
                <v-card>
                    <v-card-title>
                        <span class="headline">
                            Notifications
                        </span>
                    </v-card-title>
                </v-card>
            </v-flex>
            <v-flex xs4 class="pa-1">
                <v-card>
                    <v-card-title>
                        <span class="headline">
                            System Status
                        </span>
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Dashboard"
    }
</script>

<style scoped>

</style>