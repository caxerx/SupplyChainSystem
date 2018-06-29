<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Despatch Instruction List</v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="ml-5"
                    v-model="search"
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-btn icon @click="addItem()">
                <v-icon>add</v-icon>
            </v-btn>

            <v-btn icon @click="loadData()">
                <v-icon v-if="!isLoadingData">refresh</v-icon>
                <v-progress-circular v-else size="25" indeterminate color="blue"></v-progress-circular>
            </v-btn>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers" :items="despatchInstrutions" class="elevation-1" :search="search"
                      :pagination="pagination">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.despatchInstructionId }}</td>
                <td>{{ props.item.requestId }}</td>
                <td>{{ props.item.createTime.replace('T',' ') }}</td>
                <td>{{ props.item.despatchInstructionStatus }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="viewItem(props.item)">
                        <v-icon color="blue">info</v-icon>
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
    export default {
        name: "DespatchInstructionList",
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                pagination: {'sortBy': 'despatchInstructionId', 'descending': true, 'rowsPerPage': -1},
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        value: "despatchInstructionId"
                    },
                    {
                        text: "Request Id",
                        value: "requestId"
                    },
                    {
                        text: "Create Time",
                        value: "createTime"
                    },
                    {
                        text: "Status",
                        value: "despatchInstructionStatus"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                despatchInstrutions: [],
                selectedDespatchInstruction: {}
            };
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('despatchinstruction').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.despatchInstrutions = res.data.responseContent;
                    }
                });
            },
            viewItem(item) {
                this.selectedDespatchInstruction = item;
            }
        }
    }
</script>

<style scoped>

</style>