<template>
    <div>
        <!-- Table toolbar start -->
        <!-- TODO bind functions -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Agreement List</v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="ml-5"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>add</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon v-if="!isLoadingData">refresh</v-icon>
                <v-progress-circular
                        v-else size="25"
                        indeterminate
                        color="blue"
                ></v-progress-circular>
            </v-btn>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <!-- TODO bind values -->
        <v-data-table :headers=""
                      :items=""
                      class="elevation-1"
        >
            <template slot="" slot-scope="">
                <td></td>
                <td></td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0">
                        <v-icon color="pink">delete</v-icon>
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
        name: "AgreementList",
        data() {
            return {
                isLoadingData: false,
                headers: [],
                agreements: []
            }
        }
    }
</script>

<style scoped>

</style>