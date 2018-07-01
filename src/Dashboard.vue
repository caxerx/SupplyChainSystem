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

                <div v-for="announcement in announcements">
                    <v-card class="my-2">

                        <v-card-title primary-title>
                            <div>
                                <div class="headline">{{announcement.data.title}}</div>
                                <span class="grey--text">{{announcement.createTime.replace('T',' ')}}</span>
                            </div>
                        </v-card-title>

                        <v-divider/>

                        <v-card-text style="white-space: pre-wrap;">{{announcement.data.message}}</v-card-text>

                        <v-divider/>
                        <v-card-text>
                            <span class="grey--text">Post Until: {{announcement.data.removalTime.replace('T',' ')}}</span>
                        </v-card-text>
                    </v-card>
                </div>


                <v-alert v-if="announcements.length==0"
                         :value="true"
                         color="black"
                         icon="info"
                         outline
                >
                    No Announcement
                </v-alert>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Dashboard",
        created() {
            this.$http.get('announcement').then(res => {
                setTimeout(() => {
                    this.isLoadingData = false;
                }, 300);
                if (res.data.success) {
                    this.announcements = res.data.responseContent;
                    this.announcements = this.announcements.filter(p => this.myUserType == 999 || p.data.target.includes(this.myUserType));
                    console.log(res.data.responseContent);
                }
            });
        },
        data() {
            return {
                announcements: []
            }
        },
        computed: {
            myUserType() {
                return this.$store.state.userType;
            }
        }
    }
</script>

<style scoped>

</style>