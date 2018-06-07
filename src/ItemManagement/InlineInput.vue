<template>
    <div>
        <input type="number" :value="value" @input="$emit('input', $event.target.value)" :placeholder="label"
               :type="type">
    </div>

</template>

<script>
    export default {
        name: "InlineInput",
        props: ['value', 'label', 'type']
    }
</script>

<style scoped>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input {
        padding: 3px;
        height: 30px;
        border-bottom: 2px gray solid;
        transition: 0.3s;
    }

    input:focus {
        border-bottom: 2px black solid;
        outline: none;
    }

    input::placeholder {
        transition: 0.3s;
        color: gray;
        z-index: 100;
    }

    input:focus::placeholder {
        color: black;
    }
</style>