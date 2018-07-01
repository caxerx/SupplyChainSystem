<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Dashboard</h1>
        <!-- Page title end -->
        <v-layout row>
            <v-flex xs12 class="pa-1">
                <v-card>
                    <v-card-title>
                        <span class="headline">
                            System Announcement
                        </span>
                    </v-card-title>
                </v-card>

                <v-card class="my-2">
                    <v-card-title primary-title>
                        <div>
                            <div class="headline">Title</div>
                            <span class="grey--text">1234-48-48 23:33</span>
                        </div>
                    </v-card-title>

                    <v-card-text>
                        Plz


                        <br/>
                        <br/>
                        <span class="grey--text">Post Until: 1234-48-48 23:33</span>
                    </v-card-text>

                </v-card>


                <v-alert
                        :value="true"
                        color="black"
                        icon="info"
                        outline
                >
                    No Data
                </v-alert>
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