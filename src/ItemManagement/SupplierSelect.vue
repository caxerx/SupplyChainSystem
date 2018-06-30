<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Supplier List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="suppliers" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.supplierId }}</td>
                <td>{{ props.item.supplierName }}</td>
                <td>{{ props.item.supplierEmail }}</td>
                <td>{{ props.item.supplierPhoneNumber }}</td>
                <td>{{ props.item.supplierAddress }}</td>
                <td>{{ props.item.supplierContactPerson }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="selectItem(props.item)">
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
    import {bus} from "../main";

    export default {
        name: "",
        created() {
            this.loadData();
        },
        props: ['channel'],
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                headers: [
                    //Table header data
                    {
                        text: "Supplier Id",
                        value: "supplierId"
                    },
                    {
                        text: "Supplier Name",
                        value: "supplierName"
                    },
                    {
                        text: "E-Mail",
                        value: "supplierEmail"
                    },
                    {
                        text: "Phone Number",
                        value: "supplierPhoneNumber"
                    },
                    {
                        text: "Address",
                        value: "supplierAddress"
                    },
                    {
                        text: "Contact Person",
                        value: "supplierContactPerson"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                items: [], //User data, ajax fetch reserve
                suppliers: []
            };
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('supplier').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.suppliers = res.data.responseContent;
                        console.log(this.suppliers);
                    }
                });
            },
            selectItem(item) {
                console.log('Supplier Select:', item.supplierId);
                console.log('Supplier Select Emit: ', this.channel);
                bus.$emit(this.channel, item.supplierId);
            }
        }
    }
</script>

<style scoped>

</style>