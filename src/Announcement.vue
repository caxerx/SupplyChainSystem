<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Announcement</h1>
        <!-- Page title end -->

        <v-container>
            <!-- Table toolbar start -->
            <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                <v-toolbar-title class="white--text">Announcement List</v-toolbar-title>
                <v-text-field
                        flat
                        solo-inverted
                        prepend-icon="search"
                        label="Search"
                        class="ml-5"
                        v-model="search"
                ></v-text-field>
                <v-spacer></v-spacer>

                <v-btn icon @click="addAnnounce()">
                    <v-icon>add</v-icon>
                </v-btn>

                <v-btn icon @click="loadData()">
                    <v-icon v-if="!isLoadingData">refresh</v-icon>
                    <v-progress-circular v-else size="25" indeterminate color="blue"></v-progress-circular>
                </v-btn>
            </v-toolbar>
            <!-- Table toolbar end -->
            <!-- Table start -->
            <v-data-table :headers="headers" :items="announcements" class="elevation-1" :search="search">
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.data.title }}</td>
                    <td>{{ getTime(props.item.data.removalTime) }}</td>
                    <td class="layout px-0">
                        <v-btn icon class="mx-0" @click="showDetails(props.item)">
                            <v-icon color="info">info</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                            <v-icon color="pink">delete</v-icon>
                        </v-btn>
                    </td>
                </template>

                <template slot="no-data">
                    No Data!
                </template>
            </v-data-table>
            <!-- Table end -->
        </v-container>

        <v-container>

            <!-- Edit Dialog start -->
            <v-dialog v-model="isEditDialogShown" max-width="1000px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Create Announcement</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container fluid>
                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>Title</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                                </v-flex>
                            </v-layout>


                            <v-layout row>

                                <v-flex xs2>
                                    <v-subheader>Removal Date</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    <v-menu
                                            ref="removalDateMenu"
                                            :close-on-content-click="false"
                                            v-model="removalDateMenu"
                                            :nudge-right="40"
                                            :return-value.sync="date"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <v-text-field
                                                slot="activator"
                                                v-model="editedItem.removalTime"
                                                label="Removal Date"
                                                readonly
                                        ></v-text-field>

                                        <v-date-picker v-model="editedItem.removalTime"></v-date-picker>

                                    </v-menu>
                                </v-flex>

                            </v-layout>

                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>Message</v-subheader>
                                </v-flex>

                                <v-flex xs10>
                                    <v-textarea v-model="editedItem.message" label="Message" rows="12"></v-textarea>
                                </v-flex>
                            </v-layout>


                            <v-layout row>
                                <v-flex xs2>
                                    <v-subheader>Target</v-subheader>
                                </v-flex>
                                <v-flex xs10>
                                    <v-combobox
                                            clearable
                                            v-model="selected"
                                            :items="userTypes"
                                            label="User Type"
                                            multiple
                                            chips
                                    ></v-combobox>
                                    <!--
                                    {{lvSelect}}
                                    <v-text-field v-model="editedItem.userType"
                                                  label="User Type"></v-text-field>
                                                  -->
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Edit Dialog end -->

            <!-- Delete Confirm Dialog start -->
            <v-dialog v-model="isConfirmDialogShown" max-width="290">
                <v-card>
                    <v-card-title class="headline">Delete Item</v-card-title>
                    <v-card-text>Are you sure to delete this item? This action is irreversible.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click.native="close">Cancel</v-btn>
                        <v-btn color="green darken-1" flat @click.native="delAnnounce">Confirm</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- Delete Confirm Dialog start -->

            <v-dialog v-model="isDetailDialogShown" max-width="800">
                <v-card>
                    <v-card-title>

                        <div>
                            <div class="headline">{{detailItem.data.title}}</div>
                            <span class="grey--text">Post on: {{detailItem.createTime.replace('T',' ')}}</span>
                            <br/>
                            <span class="grey--text">Remove on: {{detailItem.data.removalTime.replace('T',' ')}}</span>
                            <div>
                                <span class="text-xs-center" v-for="item in detailItem.data.target">
                                    <v-chip>{{userType(item)}}</v-chip>
                                </span>
                            </div>
                        </div>
                    </v-card-title>
                    <v-divider/>
                    <v-card-text style="white-space: pre-wrap;">{{detailItem.data.message}}</v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click.native="close">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-container>
    </v-container>
</template>

<script>
    export default {
        name: "Announcement",
        created() {
            this.loadData();
        },
        watch: {
            isEditDialogShown(val) {
                val || this.close();
            },
            selected() {
                this.lvSelect();
            }
        },
        data() {
            return {
                search: "",
                isLoadingData: false,
                isDetailDialogShown: false,
                isEditDialogShown: false,
                isConfirmDialogShown: false,
                removalDateMenu: false,
                removalDate: "",
                date: "",
                announcements: [],
                detailItem: {
                    id: 0,
                    createTime: "",
                    data: {
                        removalTime: "",
                        title: "",
                        message: "",
                        target: []
                    }
                },
                editedItem: {},
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        align: "left",
                        value: "removalTime"
                    },
                    {
                        text: "Title",
                        value: "data.title"
                    },
                    {
                        text: "Removal Time",
                        value: "data.removalTime"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                userTypes: [
                    {code: 0, text: "Administrator"},
                    {code: 1, text: "Restaurant Manager"},
                    {code: 2, text: "Category Manager"},
                    {code: 3, text: "Purchase Manager"},
                    {code: 4, text: "Warehouse Clerk"},
                    {code: 5, text: "Accounting Manager"}
                ],
                selected: [],
                selectedAnnouncement: 0
            }
        },
        methods: {
            getTime(time) {
                return time.replace('T', ' ');
            },
            delAnnounce() {
                this.$http.delete('announcement', this.selectedAnnouncement).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.close();
                        this.loadData();
                    }
                });
            },
            deleteItem(item) {
                this.selectedAnnouncement = item.id;
                this.isConfirmDialogShown = true;
            },
            loadData() {
                this.isLoadingData = true;
                this.$http.get('announcement').then(res => {
                    setTimeout(() => {
                        this.isLoadingData = false;
                    }, 300);
                    if (res.data.success) {
                        this.announcements = res.data.responseContent;
                        console.log(res.data.responseContent);
                    }
                });
            },
            addAnnounce() {
                this.isEditDialogShown = true;
            },
            save() {
                this.editedItem.target = this.lvSelect();
                console.log(this.editedItem);
                this.$http.post('announcement', this.editedItem).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.close();
                        this.loadData();
                    }
                });
            },
            close() {
                this.isDetailDialogShown = false;
                this.isConfirmDialogShown = false;
                this.isEditDialogShown = false;
                this.editedItem = {};
                this.selected = [];
            },
            showDetails(item) {
                this.detailItem = item;
                this.isDetailDialogShown = true;
            },
            userType(item) {
                return this.userTypes.find(p => p.code === item).text;
            },
            lvSelect() {
                let filtered = [];
                for (let i of this.selected) {
                    if (i.code != undefined && i.code != null) {
                        filtered.push(i.code)
                    }
                }

                return filtered;
            }
        }
    }
</script>