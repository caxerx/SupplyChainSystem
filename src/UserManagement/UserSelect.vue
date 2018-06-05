<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">User List</v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="ml-5"
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-btn icon @click="loadData()">
                <v-icon v-if="!isLoadingData">refresh</v-icon>
                <v-progress-circular v-else size="25" indeterminate color="blue"></v-progress-circular>
            </v-btn>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers" :items="users" class="elevation-1">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.userId }}</td>
                <td>{{ props.item.userName }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.userType }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="selectUser(props.item)">
                        <v-icon color="blue">add</v-icon>
                    </v-btn>
                </td>
            </template>

            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>
        <!-- Table end -->
    </div>
</template>

<script>
    import {bus} from '../main';

    export default {
        name: "UserSelect",
        created() {
            this.loadData();
        },
        props: ['channel'],
        data() {
            return {
                search: '',
                isLoadingData: false,
                users: [],
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        align: "left",
                        value: "userId"
                    },
                    {
                        text: "Username",
                        value: "userName"
                    },
                    {
                        text: "Name",
                        value: "name"
                    },
                    {
                        text: "User Type",
                        value: "userType"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
            }
        },
        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('user').then(res => {
                    setTimeout(() => {
                        this.isLoadingData = false;
                    }, 300);
                    if (res.data.success) {
                        this.users = res.data.responseContent;
                        console.log(res.data.responseContent);
                    }
                });
            },
            selectUser(item) {
                // console.log('User select sent');
                bus.$emit(this.channel, item.userId);
            }
        }
    }
</script>

<style scoped>

</style>