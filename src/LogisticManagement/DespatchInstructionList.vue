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

            <v-btn icon @click="loadData()">
                <v-icon v-if="!isLoadingData">refresh</v-icon>
                <v-progress-circular v-else size="25" indeterminate color="blue"></v-progress-circular>
            </v-btn>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers" :items="despatchInstrutions" class="elevation-1" :search="search"
                      :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.despatchInstructionId }}</td>
                <td>{{ props.item.request.restaurant.restaurantName }}</td>
                <td>{{ props.item.createTime }}</td>
                <td>{{ props.item.despatchInstructionStatusName }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="viewItem(props.item)">
                        <v-icon color="blue">info</v-icon>
                    </v-btn>

                    <v-btn icon class="mx-0" @click="createDeliveryNote(props.item)">
                        <v-icon color="green">check</v-icon>
                    </v-btn>
                </td>
            </template>

            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>
        <!-- Table end -->

        <!-- Detail Dialog -->
        <v-dialog v-model="isDetailDialogShown" max-width="1000">
            <v-card>
                <despatch-instruction-item-list
                        :despatchInstruction="selectedDespatchInstruction"></despatch-instruction-item-list>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import DespatchInstructionItemList from "./DespatchInstructionDetail";

    export default {
        name: "DespatchInstructionList",
        components: {DespatchInstructionItemList},
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                isDetailDialogShown: false,
                pagination: {'sortBy': 'despatchInstructionId', 'descending': true, 'rowsPerPage': 5},
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        value: "despatchInstructionId"
                    },
                    {
                        text: "Restaurant",
                        value: "request.restaurant.restaurantName"
                    },
                    {
                        text: "Create Time",
                        value: "createTime"
                    },
                    {
                        text: "Status",
                        value: "despatchInstructionStatusName"
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
                        for (let i = 0; i < this.despatchInstrutions.length; i++) {
                            this.despatchInstrutions[i].createTime = this.despatchInstrutions[i].createTime.replace('T', ' ');
                            this.despatchInstrutions[i].despatchInstructionStatusName = this.getStatusName(this.despatchInstrutions[i].despatchInstructionStatus)
                        }
                    }
                });
            },
            viewItem(item) {
                this.selectedDespatchInstruction = item;
                this.isDetailDialogShown = true;
            },
            createDeliveryNote(item) {
                this.$http.put('despatchinstruction', item.despatchInstructionId).then(res => {
                    this.loadData();
                });
            },
            getStatusName(status) {
                switch (status) {
                    case 0:
                        return 'Waiting';
                    case 1:
                        return 'Finished';
                    default:
                        return 'Unknown';
                }
            }
        }
    }
</script>

<style scoped>

</style>